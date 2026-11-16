# Inter is the name for the international money transfer web app protoype.

## How to install and run the app
Inter is an international money transfer web app prototype built as part of the Topremit take-home project.

How to Install and Run the App

Prerequisites

Node.js and npm installed on your machine.

Git (if cloning the repository).

Installation

Clone the repository:

git clone <repository-url>

Navigate to the project directory:

cd inter-app

Install the dependencies:

npm install

Run the Development Server

Start the development server:

npm run dev

The application will be available at:

http://localhost:3000
## Which stack I picked and why
|Function | Tech Stack |
|---------|------------|
| Framework | TanStack Start(TanStack Router + Vite) |
| Styling | Tailwind CSS v4 + Radix UI Primitves |
| Validation | Zod |

Reasoning why I picked the said stacks:
-One of the required tech stack was TanStack Query, Thus i thought uses TanStack Start would compliment it
better
-I never used TanStack Router before, I assume Topremit uses both Next.js & TanStack, Thus i choose to utilize this take-home project as a chance to learn
-I'm not too familiar with using Chakra UI v3 to style as opposed to Tailwind. I believe styling framework sometimes has a much bigger learning curve, therefore this time I choose something thats more comfortable



## Choices I made where the task was unclear
-I was a little bit confused or atleast misunderstood on having only to choose what type of service in calculator page without immidiately give users the chance to pick which providers of said services to choose aswell in the same page. Initially I allowed the user to immidiately choose the provider in calculator but then changed my mind to make it into the review page to stay more align towards the requirement described in the take home project document. 
-Transaction status was also something that i ponder for quite some time, I Chose to have them split into three values (i.e in progress, completed, and failed). I decided to do that because, i think international transfer took some more time than normal money transfer, thus it makes more sense if user prompted with an on progress status having after just clicked continue off of review page, In which later they will find out it is now completed after navigating to history page. Not only that, i think this is just more interesting visually.

## What I'd improve with more time
- Two Languages
- Promos
- Better UI/UX on all of the pages.
- Learn more in depth about the tech stacks i chose and utilizing it better  (i.e TanStack Query, Zustand )
I think there maybe some components here that i might just did it inefficiently or in a rush in due to the time constraint that lead me to sort of consider less and inconsistent.
- Keeping more in mind regarding to split reusable components.




