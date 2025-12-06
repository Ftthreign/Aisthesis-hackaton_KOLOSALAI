"""
Cleanup utility for old uploaded files to prevent disk space issues.
Run this periodically via cron or as a scheduled task.
"""
import os
import time
import logging
from pathlib import Path
from datetime import datetime, timedelta

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

UPLOAD_DIR = Path("/app/uploads")
# Delete files older than 90 days by default
DEFAULT_RETENTION_DAYS = 90


def cleanup_old_files(retention_days: int = DEFAULT_RETENTION_DAYS) -> dict:
    """
    Remove uploaded files older than retention_days.
    
    Args:
        retention_days: Number of days to retain files
        
    Returns:
        dict with cleanup statistics
    """
    if not UPLOAD_DIR.exists():
        logger.warning(f"Upload directory {UPLOAD_DIR} does not exist")
        return {"status": "error", "message": "Upload directory not found"}
    
    cutoff_time = time.time() - (retention_days * 24 * 60 * 60)
    deleted_count = 0
    deleted_size = 0
    error_count = 0
    
    logger.info(f"Starting cleanup of files older than {retention_days} days")
    logger.info(f"Cutoff date: {datetime.fromtimestamp(cutoff_time)}")
    
    for file_path in UPLOAD_DIR.glob("*"):
        if not file_path.is_file():
            continue
            
        try:
            file_stat = file_path.stat()
            
            # Check if file is older than retention period
            if file_stat.st_mtime < cutoff_time:
                file_size = file_stat.st_size
                file_path.unlink()
                deleted_count += 1
                deleted_size += file_size
                logger.info(f"Deleted: {file_path.name} ({file_size} bytes)")
                
        except Exception as e:
            error_count += 1
            logger.error(f"Error processing {file_path.name}: {e}")
    
    # Convert bytes to MB
    deleted_size_mb = deleted_size / (1024 * 1024)
    
    result = {
        "status": "success",
        "deleted_files": deleted_count,
        "deleted_size_mb": round(deleted_size_mb, 2),
        "errors": error_count,
        "retention_days": retention_days
    }
    
    logger.info(f"Cleanup complete: {result}")
    return result


def get_disk_usage() -> dict:
    """Get current disk usage statistics for upload directory."""
    if not UPLOAD_DIR.exists():
        return {"error": "Upload directory not found"}
    
    total_size = 0
    file_count = 0
    
    for file_path in UPLOAD_DIR.glob("*"):
        if file_path.is_file():
            total_size += file_path.stat().st_size
            file_count += 1
    
    total_size_mb = total_size / (1024 * 1024)
    
    return {
        "total_files": file_count,
        "total_size_mb": round(total_size_mb, 2),
        "directory": str(UPLOAD_DIR)
    }


if __name__ == "__main__":
    import sys
    
    # Allow custom retention period from command line
    retention = DEFAULT_RETENTION_DAYS
    if len(sys.argv) > 1:
        try:
            retention = int(sys.argv[1])
        except ValueError:
            logger.error(f"Invalid retention days: {sys.argv[1]}")
            sys.exit(1)
    
    logger.info("=== File Cleanup Utility ===")
    logger.info(f"Current disk usage: {get_disk_usage()}")
    
    result = cleanup_old_files(retention)
    
    logger.info(f"Final disk usage: {get_disk_usage()}")
    
    if result["status"] == "error":
        sys.exit(1)
