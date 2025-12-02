variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of the SSH key in DigitalOcean"
  type        = string
}

variable "do_registry" {
  description = "DigitalOcean container registry name"
  type        = string
}

variable "droplet_region" {
  description = "Region for the droplet"
  type        = string
  default     = "nyc1"
}

variable "droplet_size" {
  description = "Size of the droplet"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "pvt_key" {
  description = "Path to the private SSH key"
  type        = string
  default     = "~/.ssh/id_rsa"
}

variable "db_user" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Domain name for the application"
  type        = string
}

variable "ssl_cert_path" {
  description = "Path to the Cloudflare Origin SSL certificate"
  type        = string
  default     = "../cf_cert.pem"
}

variable "ssl_key_path" {
  description = "Path to the Cloudflare Origin SSL private key"
  type        = string
  default     = "../cf_key.pem"
}
