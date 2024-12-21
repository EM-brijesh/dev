import { Icon } from "lucide-react"

export const Footer = () => {
    return (
        <><div className="flex justify-spacearound gap-20 m-8">
            <div className="align-text-bottom m-4 p-2">
                <h1 className="text-lg font-bold text-blue-600">About Us</h1>
                <h6 className="w-64">Connecting sports enthusiasts and making every game count. Join our community and find your next sports adventure.</h6>

            </div>
            <div className="align-text-bottom m-4 p-2">
                <h1 className="text-lg font-bold text-blue-600">Feedback</h1>
                <h2>Email us at</h2>
                <h6>
                    <a href="mailto:brijeshkori22@gmail.com">brijeshkori22@gmail.com</a>
                </h6>

            </div>
            
          </div>
          <hr className="my-6" />
          <div className="flex justify-center m-4 text-lg">
                2024 Khelo. All rights reserved.
            </div></>

    )
}