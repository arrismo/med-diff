# med-diff

## Setup and Running the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd med-diff
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```dotenv
    # Your Neon database connection string
    NEON_DATABASE_URL="your_neon_database_connection_string"

    # Your OpenAI API key
    OPENAI_API_KEY="your_openai_api_key"
    ```

4.  **Run the development server:**
    This command starts both the Vite frontend development server and the Node.js backend server concurrently.
    ```bash
    npm run dev
    ```

5.  **Access the application:**
    Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite). The backend server will be running on port 3000 (or the port specified in your `.env` file as `PORT`).
