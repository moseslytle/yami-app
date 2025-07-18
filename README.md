# Project-6-Ruby-No-Fails

# Description

Our Project 6 is a web platform designed to connect users with local service providers. The application addresses the challenge of finding reliable services by aggregating and curating information from various sources, including Google and Yelp. Key features include a powerful search and filtering engine (by category, date, and location), user-created personal collections of favorite providers, and a public space for sharing and discovering community-curated lists. The platform aims to simplify the process of finding and organizing local services while fostering a community of users who share valuable recommendations.

# Managers
Project Manager: Paulina Salazar
Meeting Manager: Linus Xiong
# Use Cases

### Use Case 1: User Registration 
* **Use Case Number**: 1 
* **Application**: Service Provider Platform 
* **Description**: The system allows new users to create an account by providing their name, email, and password, followed by email verification with Cloudflare Turnstile protection. 

#### Actors 
* **Primary**: Unregistered User 
* **Other**: Email Service Provider, Cloudflare Turnstile Service 

#### Stakeholders 
* **User**: Wants to create an account to access platform features. 
* **Platform Owner**: Wants to verify user authenticity and prevent spam/bot registrations. 

#### Preconditions 
* User has access to the platform registration page. 
* User has a valid email address. 
* Cloudflare Turnstile service is operational. 
* Email service is functional. 

#### Trigger 
* User accesses the registration page and decides to create an account. 

#### Basic Flow 
1.  User navigates to the registration page. 
2.  User enters their name, email address, and password. 
3.  System validates input format and password strength. 
4.  System presents Cloudflare Turnstile challenge. 
5.  User completes the Turnstile verification. 
6.  System creates user account with unverified status. 
7.  System sends verification email to provided email address. 
8.  User receives email and clicks verification link. 
9.  System activates the user account. 
10. System redirects user to login page with success message. 

#### Alternative Paths 
* **A1: Email already exists** - System displays error message and prompts user to login or reset password. 
* **A2: Turnstile verification fails** - System prompts user to retry verification. 
* **A3: Email delivery fails** - System provides option to resend verification email. 
* **A4: Verification link expires** - System allows user to request new verification email. 

---

### Use Case 2: User Login 
* **Use Case Number**: 2 
* **Application**: Service Provider Platform 
* **Description**: The system allows registered users to authenticate and access their account with Cloudflare Turnstile protection. 

#### Actors 
* **Primary**: Registered User 
* **Other**: Cloudflare Turnstile Service 

#### Stakeholders 
* **User**: Wants to access their account and platform features. 
* **Platform Owner**: Wants to ensure secure access and prevent unauthorized login attempts. 

#### Preconditions 
* User has a registered and activated account. 
* Cloudflare Turnstile service is operational. 
* User remembers their login credentials. 

#### Trigger 
* User attempts to access protected features or navigates to login page. 

#### Basic Flow 
1.  User navigates to login page. 
2.  User enters email and password. 
3.  System presents Cloudflare Turnstile challenge. 
4.  User completes the Turnstile verification. 
5.  System validates credentials against database. 
6.  System creates user session. 
7.  System redirects user to home page or intended destination. 

#### Alternative Paths 
* **A1: Invalid credentials** - System displays error message and allows retry. 
* **A2: Unverified account** - System prompts user to verify email first. 
* **A3: Turnstile verification fails** - System prompts user to retry verification. 
* **A4: Account locked** - System displays lockout message and recovery options. 

---

### Use Case 3: Password Recovery 
* **Use Case Number**: 3 
* **Application**: Service Provider Platform 
* **Description**: The system allows users to reset their forgotten password through email verification with Cloudflare Turnstile protection. 

#### Actors 
* **Primary**: Registered User 
* **Other**: Email Service Provider, Cloudflare Turnstile Service 

#### Stakeholders 
* **User**: Wants to regain access to their account when password is forgotten. 
* **Platform Owner**: Wants to provide secure password recovery while preventing abuse. 

#### Preconditions 
* User has a registered account. 
* User has access to their registered email. 
* Cloudflare Turnstile service is operational. 
* Email service is functional. 

#### Trigger 
* User clicks "Forgot Password" link on login page. 

#### Basic Flow 
1.  User clicks "Forgot Password" link. 
2.  System displays password recovery form. 
3.  User enters their registered email address. 
4.  System presents Cloudflare Turnstile challenge. 
5.  User completes the Turnstile verification. 
6.  System validates email exists in database. 
7.  System generates password reset token. 
8.  System sends password reset email with secure link. 
9.  User clicks reset link in email. 
10. System validates token and displays new password form. 
11. User enters new password and confirms. 
12. System updates password in database. 
13. System displays success message and redirects to login. 

#### Alternative Paths 
* **A1: Email not found** - System displays generic message (security measure). 
* **A2: Turnstile verification fails** - System prompts user to retry verification. 
* **A3: Reset link expired** - System prompts user to request new reset link. 
* **A4: Invalid token** - System displays error and redirects to password recovery. 

---

### Use Case 4: Browse Service Providers 
* **Use Case Number**: 4 
* **Application**: Service Provider Platform 
* **Description**: The system allows users to search and filter service providers by category, name, and operating date. 

#### Actors 
* **Primary**: User (logged in or guest) 
* **Other**: None 

#### Stakeholders 
* **User**: Wants to find suitable service providers for their needs. 
* **Service Providers**: Want their services to be discoverable by potential customers. 
* **Platform Owner**: Wants to provide effective search functionality. 

#### Preconditions 
* Platform has service provider data from Google API and Yelp API. 
* User is on the home page. 
* Service provider database is populated and accessible. 

#### Trigger 
* User navigates to home page or performs search action. 

#### Basic Flow 
1.  User accesses the home page. 
2.  System displays service provider categories (haircut, garbage collection, house cleaning, car wash, etc.). 
3.  User selects category filter or enters search term. 
4.  User optionally selects date to filter by operating hours. 
5.  System queries database for matching service providers. 
6.  System displays filtered results with provider details. 
7.  User browses through results. 
8.  User can click on provider for detailed information. 

#### Alternative Paths 
* **A1: No results found** - System displays "no results" message with suggestions. 
* **A2: Search timeout** - System displays error message and retry option. 
* **A3: Invalid date selection** - System prompts user to select valid date. 

---

### Use Case 5: Create Personal Collection 
* **Use Case Number**: 5 
* **Application**: Service Provider Platform 
* **Description**: The system allows logged-in users to create personal collections of favorite service providers. 

#### Actors 
* **Primary**: Logged-in User 
* **Other**: None 

#### Stakeholders 
* **User**: Wants to organize and save favorite service providers. 
* **Platform Owner**: Wants to increase user engagement and retention. 

#### Preconditions 
* User is logged in. 
* User has browsed service providers. 
* Service provider data is available. 

#### Trigger 
* User clicks favorite/like button on service provider or navigates to collections page. 

#### Basic Flow 
1.  User finds a service provider they like. 
2.  User clicks the favorite/like button. 
3.  System adds provider to user's personal collection. 
4.  System displays confirmation message. 
5.  User can view their collection on the collections tab. 
6.  User can organize, rename, or remove items from collection. 

#### Alternative Paths 
* **A1: User not logged in** - System redirects to login page. 
* **A2: Provider already in collection** - System displays message and option to remove. 
* **A3: Collection limit reached** - System prompts user to remove items or upgrade. 

---

### Use Case 6: Share Collection Publicly 
* **Use Case Number**: 6 
* **Application**: Service Provider Platform 
* **Description**: The system allows users to post their personal collections to the public sharing area. 

#### Actors 
* **Primary**: Logged-in User 
* **Other**: Other Platform Users 

#### Stakeholders 
* **User**: Wants to share their curated list with community. 
* **Other Users**: Want to discover collections from other users. 
* **Platform Owner**: Wants to increase user engagement and content sharing. 

#### Preconditions 
* User is logged in. 
* User has created at least one collection. 
* Collection contains at least one service provider. 

#### Trigger 
* User clicks "Share Publicly" button in their collection. 

#### Basic Flow 
1.  User navigates to their collections. 
2.  User selects collection to share. 
3.  User clicks "Share Publicly" button. 
4.  System displays sharing options and privacy settings. 
5.  User adds title, description, and privacy settings. 
6.  User confirms sharing. 
7.  System posts collection to public sharing area. 
8.  Other users can view and interact with shared collection. 

#### Alternative Paths 
* **A1: Empty collection** - System prompts user to add items before sharing. 
* **A2: Duplicate title** - System suggests alternative title or allows modification. 
* **A3: Content violation** - System flags collection for review before publishing. 

---

### Use Case 7: View Public Collections 
* **Use Case Number**: 7 
* **Application**: Service Provider Platform 
* **Description**: The system allows users to browse and view collections shared by other users in the public area. 

#### Actors 
* **Primary**: User (logged in or guest) 
* **Other**: Collection Authors 

#### Stakeholders 
* **User**: Wants to discover new service providers through community recommendations. 
* **Collection Authors**: Want their collections to be viewed and appreciated. 
* **Platform Owner**: Wants to facilitate community engagement. 

#### Preconditions 
* Public collections exist in the system. 
* User is on the collections tab. 
* Public sharing area is accessible. 

#### Trigger 
* User navigates to collections tab and selects public collections. 

#### Basic Flow 
1.  User navigates to collections tab. 
2.  User selects "Public Collections" section. 
3.  System displays list of public collections. 
4.  User browses through available collections. 
5.  User clicks on collection to view details. 
6.  System displays collection contents and author information. 
7.  User can view service providers within collection. 
8.  User can like or comment on collection (if logged in). 

#### Alternative Paths 
* **A1: No public collections** - System displays message encouraging users to share. 
* **A2: Collection unavailable** - System displays error message if collection was removed. 
* **A3: Login required for interaction** - System prompts login for liking/commenting. 

---

### Use Case 8: Auto-redirect to Login 
* **Use Case Number**: 8 
* **Application**: Service Provider Platform 
* **Description**: The system automatically redirects users to login page when they attempt to perform actions requiring authentication. 

#### Actors 
* **Primary**: Unauthenticated User 
* **Other**: None 

#### Stakeholders 
* **User**: Wants seamless access to features after authentication. 
* **Platform Owner**: Wants to protect user-specific features while maintaining good UX. 

#### Preconditions 
* User is not logged in. 
* User attempts to perform authenticated action. 
* Login system is operational. 

#### Trigger 
* User clicks favorite/like button, tries to create collection, or access protected features. 

#### Basic Flow 
1.  User performs action requiring authentication. 
2.  System detects user is not logged in. 
3.  System stores intended action/destination. 
4.  System redirects user to login page. 
5.  System displays message explaining login requirement. 
6.  User completes login process. 
7.  System redirects user back to original intended action/page. 
8.  System completes the originally requested action. 

#### Alternative Paths 
* **A1: User cancels login** - System returns to previous page without completing action. 
* **A2: Login fails** - System keeps user on login page with error message. 
* **A3: Session expires during action** - System re-prompts for login and continues. 

---

## Routes 

### Providers Routes 

#### `GET /api/v1/providers` 
* **Description**: Retrieve all service providers with optional pagination. 
* **Verb**: GET 
* **Authentication**: Optional (some features require login) 
* **Query Parameters**: 
    * `page` (integer, optional): Page number for pagination (default: 1). 
    * `limit` (integer, optional): Number of items per page (default: 20, max: 100). 
    * `sort` (string, optional): Sort order - name_asc, name_desc, rating_asc, rating_desc, created_asc, created_desc (default: name_asc). 
    * `include_closed` (boolean, optional): Include providers that are currently closed (default: false). 
* **Response Format**: 
    ```json
    {
      "success": true,
      "data": {
        "providers": [
          {
            "id": "string",
            "name": "string",
            "category": "string",
            "rating": "number",
            "address": "string",
            "phone": "string",
            "is_open": "boolean",
            "hours": "object",
            "image_url": "string"
          }
        ],
        "pagination": {
          "current_page": "number",
          "total_pages": "number",
          "total_items": "number",
          "has_next": "boolean",
          "has_previous": "boolean"
        }
      }
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid query parameters. 
    * `500 Internal Server Error`: Server error. 

---

#### `GET /api/v1/providers/search` 
* **Description**: Search and filter service providers by various criteria. 
* **Verb**: GET 
* **Authentication**: Optional 
* **Query Parameters**: 
    * `q` (string, optional): Search query for provider name or description. 
    * `category` (string, optional): Filter by service category (e.g., "haircut", "cleaning", "car_wash"). 
    * `date` (string, optional): Filter by operating date (format: YYYY-MM-DD). 
    * `latitude` (number, optional): User's latitude for location-based search. 
    * `longitude` (number, optional): User's longitude for location-based search. 
    * `radius` (number, optional): Search radius in kilometers (default: 10, max: 50). 
    * `min_rating` (number, optional): Minimum rating filter (1-5). 
    * `price_range` (string, optional): Price range filter - $, $$, $$$, $$$$. 
    * `open_now` (boolean, optional): Filter for currently open providers (default: false). 
    * `page` (integer, optional): Page number for pagination (default: 1). 
    * `limit` (integer, optional): Number of items per page (default: 20, max: 100). 
    * `sort` (string, optional): Sort order - relevance, distance, rating, name (default: relevance). 
* **Response Format**: 
    ```json
    {
      "success": true,
      "data": {
        "providers": [
          {
            "id": "string",
            "name": "string",
            "category": "string",
            "rating": "number",
            "address": "string",
            "distance": "number",
            "is_open": "boolean",
            "price_range": "string",
            "image_url": "string",
            "relevance_score": "number"
          }
        ],
        "search_metadata": {
          "query": "string",
          "filters_applied": "object",
          "total_results": "number"
        },
        "pagination": {
          "current_page": "number",
          "total_pages": "number",
          "has_next": "boolean",
          "has_previous": "boolean"
        }
      }
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid search parameters. 
    * `422 Unprocessable Entity`: Invalid date format or coordinates. 
    * `500 Internal Server Error`: Server error. 

---

#### `GET /api/v1/providers/:id` 
* **Description**: Get detailed information about a specific service provider. 
* **Verb**: GET 
* **Authentication**: Optional 
* **Path Parameters**: 
    * `id` (string, required): Unique identifier of the service provider. 
* **Query Parameters**: 
    * `include_reviews` (boolean, optional): Include customer reviews (default: false). 
    * `include_photos` (boolean, optional): Include photo gallery (default: false). 
    * `include_services` (boolean, optional): Include detailed service list (default: false). 
* **Response Format**: 
    ```json
    {
      "success": true,
      "data": {
        "provider": {
          "id": "string",
          "name": "string",
          "description": "string",
          "category": "string",
          "subcategory": "string",
          "rating": "number",
          "review_count": "number",
          "address": "string",
          "phone": "string",
          "email": "string",
          "website": "string",
          "price_range": "string",
          "hours": {
            "monday": "string",
            "tuesday": "string",
            "wednesday": "string",
            "thursday": "string",
            "friday": "string",
            "saturday": "string",
            "sunday": "string"
          },
          "location": {
            "latitude": "number",
            "longitude": "number"
          },
          "images": ["string"],
          "services": [
            {
              "name": "string",
              "description": "string",
              "price": "string"
            }
          ],
          "reviews": [
            {
              "id": "string",
              "author": "string",
              "rating": "number",
              "comment": "string",
              "date": "string"
            }
          ],
          "is_favorited": "boolean",
          "created_at": "string",
          "updated_at": "string"
        }
      }
    }
    ```
* **Error Responses**: 
    * `404 Not Found`: Provider not found. 
    * `500 Internal Server Error`: Server error. 

---

### User Collections Route 

#### `GET /api/v1/collections` 
* **Description**: Retrieve all public collections with pagination. 
* **Verb**: GET 
* **Authentication**: Optional 
* **Query Parameters**: 
    * `page` (integer, optional): Page number for pagination (default: 1). 
    * `limit` (integer, optional): Number of items per page (default: 20, max: 100). 
    * `sort` (string, optional): Sort order - popular, recent, name_asc, name_desc (default: popular). 
    * `category` (string, optional): Filter collections by service category. 
    * `search` (string, optional): Search collections by title or description. 
* **Response Format**: 
    ```json
    {
      "success": true,
      "data": {
        "collections": [
          {
            "id": "string",
            "title": "string",
            "description": "string",
            "author": {
              "id": "string",
              "name": "string",
              "avatar_url": "string"
            },
            "provider_count": "number",
            "like_count": "number",
            "view_count": "number",
            "is_liked": "boolean",
            "created_at": "string",
            "updated_at": "string",
            "thumbnail_url": "string"
          }
        ],
        "pagination": {
          "current_page": "number",
          "total_pages": "number",
          "total_items": "number",
          "has_next": "boolean",
          "has_previous": "boolean"
        }
      }
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid query parameters. 
    * `500 Internal Server Error`: Server error. 

---

#### `GET /api/v1/collections/:id` 
* **Description**: Get detailed information about a specific public collection. 
* **Verb**: GET 
* **Authentication**: Optional 
* **Path Parameters**: 
    * `id` (string, required): Unique identifier of the collection. 
* **Response Format**: 
    ```json
    {
      "success": true,
      "data": {
        "collection": {
          "id": "string",
          "title": "string",
          "description": "string",
          "author": {
            "id": "string",
            "name": "string",
            "avatar_url": "string"
          },
          "providers": [
            {
              "id": "string",
              "name": "string",
              "category": "string",
              "rating": "number",
              "address": "string",
              "image_url": "string",
              "added_at": "string",
              "note": "string"
            }
          ],
          "like_count": "number",
          "view_count": "number",
          "is_liked": "boolean",
          "created_at": "string",
          "updated_at": "string",
          "tags": ["string"]
        }
      }
    }
    ```
* **Error Responses**: 
    * `404 Not Found`: Collection not found. 
    * `403 Forbidden`: Collection is private. 
    * `500 Internal Server Error`: Server error. 

---

### User Route 

#### `POST /api/v1/auth/register` 
* **Description**: Register a new user account with email verification. 
* **Verb**: POST 
* **Authentication**: None (public endpoint) 
* **Request Body**: 
    ```json
    {
      "name": "string (required, 2-50 characters)",
      "email": "string (required, valid email format)",
      "password": "string (required, min 8 characters)",
      "password_confirmation": "string (required, must match password)",
      "turnstile_token": "string (required, Cloudflare Turnstile token)"
    }
    ```
* **Response Format**: 
    ```json
    {
      "success": true,
      "message": "Registration successful. Please check your email for verification instructions.",
      "data": {
        "user": {
          "id": "string",
          "name": "string",
          "email": "string",
          "is_verified": false,
          "created_at": "string"
        }
      }
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid input data or validation errors. 
    * `409 Conflict`: Email already exists. 
    * `422 Unprocessable Entity`: Turnstile verification failed. 
    * `500 Internal Server Error`: Server error. 

---

#### `POST /api/v1/auth/login` 
* **Description**: Authenticate user and create session. 
* **Verb**: POST 
* **Authentication**: None (public endpoint) 
* **Request Body**: 
    ```json
    {
      "email": "string (required, valid email format)",
      "password": "string (required)",
      "turnstile_token": "string (required, Cloudflare Turnstile token)",
      "remember_me": "boolean (optional, default: false)"
    }
    ```
* **Response Format**: 
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": {
          "id": "string",
          "name": "string",
          "email": "string",
          "is_verified": "boolean",
          "avatar_url": "string",
          "created_at": "string"
        },
        "access_token": "string",
        "refresh_token": "string",
        "expires_in": "number"
      }
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid input data. 
    * `401 Unauthorized`: Invalid credentials. 
    * `403 Forbidden`: Account not verified. 
    * `422 Unprocessable Entity`: Turnstile verification failed. 
    * `429 Too Many Requests`: Rate limit exceeded. 
    * `500 Internal Server Error`: Server error. 

---

#### `POST /api/v1/auth/password/forgot` 
* **Description**: Request password reset email. 
* **Verb**: POST 
* **Authentication**: None (public endpoint) 
* **Request Body**: 
    ```json
    {
      "email": "string (required, valid email format)",
      "turnstile_token": "string (required, Cloudflare Turnstile token)"
    }
    ```
* **Response Format**: 
    ```json
    {
      "success": true,
      "message": "If an account with that email exists, you will receive password reset instructions."
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid input data. 
    * `422 Unprocessable Entity`: Turnstile verification failed. 
    * `429 Too Many Requests`: Rate limit exceeded. 
    * `500 Internal Server Error`: Server error. 

---

#### `POST /api/v1/auth/password/reset` 
* **Description**: Reset password using reset token. 
* **Verb**: POST 
* **Authentication**: None (public endpoint) 
* **Request Body**: 
    ```json
    {
      "token": "string (required, password reset token)",
      "email": "string (required, valid email format)",
      "password": "string (required, min 8 characters)",
      "password_confirmation": "string (required, must match password)"
    }
    ```
* **Response Format**: 
    ```json
    {
      "success": true,
      "message": "Password reset successful. You can now login with your new password."
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid input data or validation errors. 
    * `401 Unauthorized`: Invalid or expired token. 
    * `422 Unprocessable Entity`: Token and email mismatch. 
    * `500 Internal Server Error`: Server error. 

---

#### `GET /api/v1/auth/verify/:token` 
* **Description**: Verify user email address using verification token. 
* **Verb**: GET 
* **Authentication**: None (public endpoint) 
* **Path Parameters**: 
    * `token` (string, required): Email verification token. 
* **Response Format**: 
    ```json
    {
      "success": true,
      "message": "Email verified successfully. You can now login to your account.",
      "data": {
        "user": {
          "id": "string",
          "name": "string",
          "email": "string",
          "is_verified": true,
          "verified_at": "string"
        }
      }
    }
    ```
* **Error Responses**: 
    * `400 Bad Request`: Invalid token format. 
    * `401 Unauthorized`: Invalid or expired token. 
    * `409 Conflict`: Email already verified. 
    * `500 Internal Server Error`: Server error. 

---

### User-Specific Endpoints (Authenticated) 

#### `GET /api/v1/user/collections` 
* **Description**: Get user's personal collections. 
* **Verb**: GET 
* **Authentication**: Required (Bearer token) 
* **Query Parameters**: 
    * `page` (integer, optional): Page number for pagination (default: 1). 
    * `limit` (integer, optional): Number of items per page (default: 20, max: 100). 
    * `sort` (string, optional): Sort order - recent, name_asc, name_desc (default: recent). 
* **Response Format**: 
    ```json
    {
      "success": true,
      "data": {
        "collections": [
          {
            "id": "string",
            "title": "string",
            "description": "string",
            "provider_count": "number",
            "is_public": "boolean",
            "like_count": "number",
            "view_count": "number",
            "created_at": "string",
            "updated_at": "string"
          }
        ],
        "pagination": {
          "current_page": "number",
          "total_pages": "number",
          "total_items": "number"
        }
      }
    }
    ```

#### `POST /api/v1/user/collections` 
* **Description**: Create a new personal collection. 
* **Verb**: POST 
* **Authentication**: Required (Bearer token) 
* **Request Body**: 
    ```json
    {
      "title": "string (required, 3-100 characters)",
      "description": "string (optional, max 500 characters)",
      "is_public": "boolean (optional, default: false)",
      "provider_ids": ["string"]
    }
    ```

#### `DELETE /api/v1/user/collections` 
* **Description**: Delete a new personal collection. 
* **Verb**: Delete 
* **Authentication**: Required (Bearer token) 
* **Path Parameters**: 
    * `collections_id` (string, required): ID of the user collections. 

#### `PUT /api/v1/user/collections/:id/publish` 
* **Description**: Publish or unpublish a personal collection to make it publicly visible. 
* **Verb**: PUT 
* **Authentication**: Required (Bearer token) 
* **Path Parameters**: 
    * `id` (string, required): Unique identifier of the collection to publish/unpublish. 

#### `POST /api/v1/user/favorites/:provider_id` 
* **Description**: Add provider to user's favorites. 
* **Verb**: POST 
* **Authentication**: Required (Bearer token) 
* **Path Parameters**: 
    * `provider_id` (string, required): ID of the provider to favorite. 
    * `collections_id` (string, required): ID of the user collections. 

#### `DELETE /api/v1/user/favorites/:provider_id` 
* **Description**: Remove provider from user's favorites. 
* **Verb**: DELETE 
* **Authentication**: Required (Bearer token) 
* **Path Parameters**: 
    * `provider_id` (string, required): ID of the provider to unfavorite. 
    * `collections_id` (string, required): ID of the user collections. 

---

## Rate Limiting 
* **Authentication endpoints**: 5 requests per minute per IP 
* **Search endpoints**: 100 requests per minute per IP 
* **General endpoints**: 1000 requests per hour per user 
* **File upload endpoints**: 10 requests per minute per user 

## Common HTTP Status Codes 
* `200 OK`: Request successful 
* `201 Created`: Resource created successfully 
* `400 Bad Request`: Invalid request parameters 
* `401 Unauthorized`: Authentication required 
* `403 Forbidden`: Access denied 
* `404 Not Found`: Resource not found 
* `409 Conflict`: Resource already exists 
* `422 Unprocessable Entity`: Validation failed 
* `429 Too Many Requests`: Rate limit exceeded 
* `500 Internal Server Error`: Server error 

---

## State Diagram 
![State Diagram showing the flow from the home page through Browse, login, registration, and managing personal collections.](./storage/github/state_diagram.png)

**Did all team members attend the meeting to work on this submission?** 
* Yes, all team members attend the meeting to work on this submission. 

**If not, which team members did not attend the meeting?** 
* (N/A)

# Meeting Reports

# Contributions

# Source Code Status Report
# Overall
# Stand Up Meeting Recording

---

# Sprint 1: Initial ServiceScope Setup, Routes, HTML

### Sprint Goal
Create the project foundation by setting up the database schema, populating it with service provider data from external APIs, and creating basic HTML templates for core user interactions.

### Planned Functionality

#### Database Setup & Schema
* **Users Table**: id, name, email, password_hash, is_verified, created_at, updated_at
* **Service Providers Table**: id, name, category, rating, address, phone, hours, latitude, longitude, image_url, price_range, google_place_id, yelp_id, created_at, updated_at
* **Collections Table**: id, user_id, title, description, is_public, created_at, updated_at
* **Collection Items Table**: id, collection_id, provider_id, added_at, user_note
* **User Favorites Table**: id, user_id, provider_id, created_at

#### Data Population
* Google Places API integration for service provider data.
* Yelp API integration for additional provider information and reviews.
* Data cleaning and normalization scripts.
* Initial seed data for testing.

#### HTML Skeleton Pages
* **Landing/Home Page**: Service provider Browse interface.
* **Registration Page**: User signup form with Turnstile.
* **Login Page**: User authentication form.
* **Collections Page**: Personal and public collections view.
* **Provider Detail Page**: Individual service provider information.
* **User Profile Page**: Basic user account management.

### Team Member Work Allocation

#### Moses
* **Routes to Implement**:
    * `POST /api/v1/auth/register` - User registration
    * `POST /api/v1/auth/login` - User login
    * `GET /api/v1/auth/verify/:token` - Email verification
    * `POST /api/v1/auth/password/forgot` - Password reset request
* **Tasks**:
    * Design and implement user account database schema (users table, authentication tokens).
    * Create database migration scripts.
    * Create HTML templates for registration/login pages.

#### Linus
* **Tasks**:
    * Create database migration scripts.
    * Design the collections database.
* **Routes to Implement**:
    * `GET /api/v1/collections`
    * `GET /api/v1/collections/:id`
    * `POST /api/v1/auth/password/reset`
    * `GET /api/v1/user/collections`

#### Paulina
* **Routes to Implement**:
    * `GET /api/v1/providers/:id` - Individual service provider information
    * `GET /api/v1/providers/search` - Search and filter service providers
    * `GET /api/v1/providers` - All service providers
* **Tasks**:
    * Initialize the service providers database.
    * Implement API integration to populate service providers data.
    * Create service provider and user profile HTML pages.

#### Joshua
* **Routes to Implement**:
    * `POST /api/v1/user/collections`
    * `DELETE /api/v1/user/collections/:id`
    * `PUT /api/v1/user/collections/:id/publish`
    * `POST /api/v1/user/favorites/:provider_id`
    * `DELETE /api/v1/user/favorites/:provider_id`
* **Tasks**:
    * Create the user collection database and dependence.
    * Set up database relationships.
    * Implement the base user collection html.

### Deliverables for Sprint #1
- **Moses**
    - Implemented API endpoints for user registration, login, email verification, and password reset requests.
    - Completed database schema design for user accounts and authentication tokens.
    - Functional HTML templates for user registration and login pages.
    - Created necessary database migration scripts.

- **Linus**
    - Completed database design for user collections.
    - Implemented API endpoints for retrieving public and user-specific collections, as well as handling password resets.
    - Created necessary database migration scripts.
    - A functional base HTML page for user collections.

- **Paulina**
    - Implemented API endpoints for retrieving all providers, searching/filtering providers, and viewing individual provider details.
    - A populated service providers database, integrated with external APIs.
    - Functional HTML skeleton pages for viewing service provider details and user profiles.

- **Joshua**
    - Implemented API endpoints for creating, deleting, and publishing user collections.
    - Implemented API endpoints for adding and removing providers from a user's favorites.
    - Completed user collection database schema and established relationships.
    - A functional base HTML page for user collections.

---

# Sprint #2

# Continue sprints ...
