provider "aws" {
  region = "us-east-1"
}

# Use the default VPC
data "aws_vpc" "default" {
  default = true
}

# Create a security group for the EC2 instance
resource "aws_security_group" "ec2_security_group" {
  name_prefix = "EC2-SG-CARTS"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Creating a nano EC2 instance
resource "aws_instance" "carts-instance" {
  ami                    = "ami-id"
  instance_type          = "t4g.nano"
  key_name               = "key"
  vpc_security_group_ids = [aws_security_group.ec2_security_group.id]
}

# Create a security group for the RDS instance
resource "aws_security_group" "rds_security_group" {
  name_prefix = "RDS-SG-CARTS"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Creating an Amazon RDS PostgreSQL instance
resource "aws_db_instance" "my_rds_instance" {
  identifier             = "my-rds-instance"
  engine                 = "postgres"
  instance_class         = "db.t4g.micro"
  username               = "user"
  password               = "pass"
  allocated_storage      = 20
  storage_type           = "gp2"
  multi_az               = false
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
  skip_final_snapshot    = true
  publicly_accessible    = true
}
