terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_ssh_key" "main" {
  name = var.ssh_key_name
}

data "digitalocean_container_registry" "aisthesis" {
  name = var.do_registry
}

resource "digitalocean_container_registry_docker_credentials" "aisthesis" {
  registry_name = var.do_registry
}

resource "digitalocean_droplet" "aisthesis" {
  image    = "ubuntu-24-04-x64"
  name     = "aisthesis-production"
  region   = var.droplet_region
  size     = var.droplet_size
  ssh_keys = [data.digitalocean_ssh_key.main.id]

  user_data = templatefile("cloud-config.yaml", {
    docker_auth  = indent(6, digitalocean_container_registry_docker_credentials.aisthesis.docker_credentials)
    registry_url = "registry.digitalocean.com/${var.do_registry}"
    db_user      = var.db_user
    db_password  = var.db_password
    jwt_secret   = var.jwt_secret
    domain       = var.domain
    ssl_cert     = indent(6, file(var.ssl_cert_path))
    ssl_key      = indent(6, file(var.ssl_key_path))
  })

  connection {
    type        = "ssh"
    user        = "root"
    private_key = file(pathexpand(var.pvt_key))
    host        = self.ipv4_address
  }

  provisioner "remote-exec" {
    inline = [
      "cloud-init status --wait"
    ]
  }
}

resource "digitalocean_firewall" "aisthesis" {
  name        = "aisthesis-firewall"
  droplet_ids = [digitalocean_droplet.aisthesis.id]

  # SSH
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # All outbound traffic
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

output "droplet_ip" {
  value       = digitalocean_droplet.aisthesis.ipv4_address
  description = "Public IP address of the Aisthesis droplet"
}

output "droplet_status" {
  value       = digitalocean_droplet.aisthesis.status
  description = "Status of the droplet"
}
