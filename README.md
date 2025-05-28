# UniThrift

UniThrift is a web-based marketplace designed specifically for students to buy and sell second-hand items such as electronics, furniture, clothing, and more. By providing a localized, campus-centric platform, UniThrift enables students to save money, declutter, and sustainably reuse essential items.

## 🚀 Features

- 🛒 **Buy & Sell:** Students can post ads for items they want to sell or browse listings by others.
- 📷 **Image Uploads:** Upload clear item photos to make listings more appealing.
- 🧠 **Smart Categories:** Items are organized by type (e.g., electronics, furniture, clothing) for easier browsing.
- 📍 **Location-Based Filtering:** Buyers can search listings from their specific university or campus.
- 📱 **Mobile-Responsive UI:** Optimized for all screen sizes using HTML5, Bootstrap, and custom JavaScript.
- 🔍 **Search & Filter:** Advanced search and filtering to quickly find desired items.
- 🛡️ **Moderation Tools (Planned):** Admin dashboard for reporting and reviewing flagged items.

---

## 🧰 Tech Stack

**Frontend:**
- HTML5
- CSS3 + Bootstrap
- JavaScript (Vanilla JS)

**Backend (Planned/Implemented):**
- Java + Spring Boot
- RESTful API endpoints for item listing, search, user auth, etc.

**Database:**
- MySQL / PostgreSQL (Spring Data JPA)

**Deployment:**
- Runs locally (laptop-based)
- Planned deployment with Heroku / Netlify / Railway or local hosting

---

## 🖼️ Screenshots

> *(Include actual screenshots if available)*  
![Home Page](screenshots/home.png)  
![Product Listing](screenshots/listing.png)  
![Post Item](screenshots/post-item.png)

---

## 📦 Installation & Setup

### Prerequisites

- JDK 17+
- Node.js (for potential frontend tooling)
- MySQL or PostgreSQL installed locally
- Spring Boot CLI (optional)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/your-username/unithrift.git
cd unithrift

# Open in your preferred IDE (IntelliJ/VS Code)

# Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/unithrift
spring.datasource.username=your_username
spring.datasource.password=your_password

# Run the backend
./mvnw spring-boot:run
