# Cloud-IDE
# CloudIDE

Welcome to **CloudIDE**, a cloud-based Integrated Development Environment (IDE) built using Node.js, Docker, and AWS. This project aims to provide a seamless development experience with the power of cloud.
## Live Demo

Visit the live demo at: [cloudide.aniketghavte.xyz](https://cloudide.aniketghavte.xyz)

![CloudIDE Demo](https://raw.githubusercontent.com/aniketghavte/assets/main/cloudide-demo.png)
*CloudIDE in action showing the integrated terminal and code editor*

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

CloudIDE is designed to offer a robust and scalable development environment accessible from anywhere. It leverages the power of Node.js for the backend, Docker for containerization, and AWS for cloud services.

## Features

- **Cloud-based**: Access your development environment from anywhere.
- **Scalable**: Easily scale resources based on demand.
- **Containerized**: Use Docker to ensure consistent environments.
- **Secure**: Built with security best practices in mind.

## Architecture

The repository consists of two main components:

1. **Client**: The frontend of the IDE, built with modern web technologies.
2. **Server**: The backend, built using Node.js, which handles API requests and manages Docker containers.

### High-Level Architecture

```
+-------------------+       +-------------------+
|                   |       |                   |
|      Client       | <---> |      Server       |
|                   |       |                   |
+-------------------+       +-------------------+
           |                         |
           v                         v
+-------------------+       +-------------------+
|                   |       |                   |
|      Docker       |       |       AWS         |
|                   |       |                   |
+-------------------+       +-------------------+
```

## Setup

### Prerequisites

- Node.js
- Docker
- AWS Account

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/cloudIDE.git
    cd cloudIDE
    ```

2. **Install dependencies:**
    ```sh
    cd server
    npm install
    cd ../client
    npm install
    ```

3. **Configure AWS:**
    - Set up your AWS credentials.
    - Configure necessary AWS services (e.g., S3, EC2).

4. **Build Docker images:**
    ```sh
    docker-compose build
    ```

5. **Run the application:**
    ```sh
    docker-compose up
    ```

## Usage

- Access the IDE via `http://localhost:3000`.
- Use the provided interface to write, run, and debug your code.

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.