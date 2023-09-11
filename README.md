# ÉLIER Overview Section API
### Problem
The objective of this project is to create an API service designed for an eCommerce website called ÉLIER. The service's performance requirements necessitate a maximum latency of 2000ms, support for 100 requests per second, and an error rate below 1%. Subsequently, the plan is to deploy and scale this service to accommodate at least 100 requests per second on an EC2 instance using a t2.micro configuration.

### Achievement
In the final stages of this project, I successfully achieved outstanding results. I attained a latency of 24ms, enabling the system to effortlessly handle a staggering 3000 requests per second. Most notably, the error rate remained consistently at 0%.

## Built With
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white)



### Approach
Given the highly organized nature of eCommerce data and the need for rapid data access to enhance the customer experience, a decision was made to employ a relational database.

In the course of this project, I was responsible for managing the endpoints related to product details, which involved dealing with huge data volumes, including images, stock information, and essential product details.

In the quest for an appropriate SQL database, I settled on PostgreSQL after discovering its robust aggregate functions. The frontend already anticipated data in a specific format, leading me to hypothesize that combining tables within the database would outperform fetching data and conducting post-processing using JavaScript.

This hypothesis was confirmed by the results. To provide additional context, the initial query times were over 20 seconds. However, by introducing indexing, response times were reduced to around 5000ms. This performance further improved once I implemented aggregate functions and optimized my database configuration, I was able to further reduce query time to 10ms while handling 650 requests per second.


Finally, for deployment, an AWS infrastructure was selected, consisting of an NGINX EC2 T2 Micro instance for load balancing and caching, a single instance used for server and database using Docker. This configuration resulted in a 24ms latency and the capability to handle up to 3000 requests per second with an error rate of 0%.