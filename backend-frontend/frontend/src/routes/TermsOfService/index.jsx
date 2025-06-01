import React from "react"

const TermsOfService = () => {
  return (
      // <div className="flex flex-col min-h-screen ">
      //   <main className="flex-grow flex items-center justify-center p-4">
      //     <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden font-copernicus mt-16 mb-16">
      //       <div className="p-8">
      //         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
      //           uGem Terms of Service
      //         </h1>
      //         <p className="text-sm text-gray-600 mb-6 text-center">
      //           Last Updated: July 26, 2024
      //         </p>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             1. Acceptance of Terms
      //           </h2>
      //           <p className="text-gray-600">
      //             By accessing or using the uGem app ("Service"), you agree
      //             to be bound by these Terms of Service ("Terms"). If you disagree
      //             with any part of the terms, you may not access the Service.
      //           </p>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             2. Description of Service
      //           </h2>
      //           <p className="text-gray-600">
      //             uGem is a platform that allows businesses to create and
      //             manage promotional campaigns for their customers. Customers can
      //             view and interact with these campaigns through the uGem
      //             app.
      //           </p>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             3. User Accounts
      //           </h2>
      //           <ul className="list-disc list-inside text-gray-600">
      //             <li>
      //               You must be at least 18 years old to use this Service as a
      //               business account holder.
      //             </li>
      //             <li>
      //               You are responsible for maintaining the confidentiality of
      //               your account and password.
      //             </li>
      //             <li>
      //               You agree to accept responsibility for all activities that
      //               occur under your account.
      //             </li>
      //           </ul>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             4. Business Campaigns
      //           </h2>
      //           <p className="text-gray-600">
      //             Businesses using uGem have the ability to create and manage
      //             promotional campaigns. By creating a campaign, you agree to:
      //           </p>
      //           <ul className="list-disc list-inside text-gray-600">
      //             <li>
      //               Provide accurate and truthful information about your
      //               promotions.
      //             </li>
      //             <li>
      //               Comply with all applicable laws and regulations regarding
      //               promotions and advertising.
      //             </li>
      //             <li>
      //               Take full responsibility for the content and execution of your
      //               campaigns.
      //             </li>
      //             <li>
      //               Not use the Service to promote any illegal or prohibited items
      //               or services.
      //             </li>
      //           </ul>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             5. Customer Interactions
      //           </h2>
      //           <p className="text-gray-600">
      //             Customers using uGem to view and interact with business
      //             campaigns agree to:
      //           </p>
      //           <ul className="list-disc list-inside text-gray-600">
      //             <li>
      //               Use the Service for personal, non-commercial purposes only.
      //             </li>
      //             <li>
      //               Not attempt to manipulate or abuse any promotional offerings.
      //             </li>
      //             <li>
      //               Provide accurate information when participating in campaigns.
      //             </li>
      //           </ul>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             6. Intellectual Property
      //           </h2>
      //           <p className="text-gray-600">
      //             The Service and its original content, features, and
      //             functionality are owned by uGem and are protected by
      //             international copyright, trademark, patent, trade secret, and
      //             other intellectual property laws.
      //           </p>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             7. Limitation of Liability
      //           </h2>
      //           <p className="text-gray-600">
      //             uGem is not responsible for the content of business
      //             campaigns or the fulfillment of any promotions offered through
      //             our platform. In no event shall uGem, nor its directors,
      //             employees, partners, agents, suppliers, or affiliates, be liable
      //             for any indirect, incidental, special, consequential or punitive
      //             damages.
      //           </p>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             8. Changes to Terms
      //           </h2>
      //           <p className="text-gray-600">
      //             We reserve the right to modify or replace these Terms at any
      //             time. We will provide notice of any significant changes.
      //           </p>
      //         </section>
      //
      //         <section className="mb-6">
      //           <h2 className="text-xl font-semibold text-gray-800 mb-2">
      //             9. Contact Us
      //           </h2>
      //           <p className="text-gray-600">
      //             If you have any questions about these Terms, please contact us
      //             at team@ugem.app.
      //           </p>
      //         </section>
      //       </div>
      //     </div>
      //   </main>
      // </div>
      <div className="flex flex-col">
        <main className="flex-grow flex items-center justify-center py-28 px-4 md:px-16 lg:px-32 xl:px-60">
          <div className="bg-white rounded-xl shadow-md w-full overflow-hidden font-copernicus mt-8 mb-16 border border-gray-200">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Terms of Service for uGem
              </h1>
              <p className=" text-gray-600 mb-6 text-center text-lg">
                Effective Date: 12.12.2024
              </p>

              <section className="mb-6">
                <p className="text-gray-600  text-lg">
                  Welcome to uGem ("we," "our," or "us"). By accessing or using our mobile application ("App") and
                  associated services, you agree to these Terms of Service ("Terms"). If you do not agree to these
                  Terms, you must not use our App or associated services.
                </p>
                <p className="text-gray-600 text-lg">
                  These Terms are a legally binding agreement and include important information about your rights and
                  responsibilities when using uGem. Please read them carefully.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  1. Introduction
                </h2>
                <h3 className="text-lg font-semibold text-gray-700">
                  Service Provider
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  These Terms are an agreement between you and uGem, provided by [Your Company Name and Address].
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Age and Eligibility Requirements
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  By using our App, you affirm that you are at least 13 years old. If you are under 18, you must have
                  parental or guardian consent to enter into these Terms.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Additional Agreements
                </h3>
                <p className="text-gray-600 text-lg">
                  Your use of the App is also subject to:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-lg mb-4">
                  <li><strong>Privacy Policy</strong></li>
                  <li><strong>Additional Terms and Conditions</strong> that may apply to specific features or services.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  2. Use of the uGem Service
                </h2>
                <h3 className="text-lg font-semibold text-gray-700">
                  Account Creation
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  You may be required to create an account to use certain features of the App. You are responsible for
                  maintaining the confidentiality of your username and password and all activities under your account.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Grant of Access
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  We grant you a limited, non-exclusive, revocable license to use the App for personal or business
                  purposes, provided you comply with these Terms and applicable laws.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Prohibited Activities
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-lg mb-4">
                  <li>Use the App for unlawful purposes.</li>
                  <li>Reverse-engineer, duplicate, or attempt to exploit the App.</li>
                  <li>Interfere with or disrupt the App’s functionality.</li>
                  <li>Violate the intellectual property rights of uGem or third parties.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  3. Subscriptions and Payments
                </h2>
                <h3 className="text-lg font-semibold text-gray-700">
                  Free and Paid Services
                </h3>
                <p className="text-gray-600  text-lg mb-4">
                  uGem offers both free and paid subscription plans. Features may vary by plan.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Payments and Billing
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-lg mb-4">
                  <li>Payment is required in advance for paid subscriptions.</li>
                  <li>All prices include applicable taxes unless stated otherwise.</li>
                  <li>By purchasing a subscription, you agree to the billing terms presented at the time of purchase.
                  </li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-700">
                  Trials and Promotions
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  Trial subscriptions may be offered at our discretion. Terms for trials will be outlined separately.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Renewal and Cancellation
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  Subscriptions renew automatically unless canceled. To avoid charges, cancel before the end of the
                  current billing cycle. Refunds are not provided for partial periods unless required by law.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  4. User Content
                </h2>
                <h3 className="text-lg font-semibold text-gray-700">
                  Ownership of Content
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  You retain ownership of any content you upload to the App. By uploading, you grant uGem a
                  non-exclusive, royalty-free license to use your content solely to provide the services.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Prohibited Content
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-lg mb-4">
                  <li>Is illegal, harmful, or abusive.</li>
                  <li>Violates intellectual property rights.</li>
                  <li>Contains malicious code or disrupts the App’s functionality.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  5. Data and Privacy
                </h2>
                <p className="text-gray-600 text-lg">
                  Our use of your personal data is governed by the uGem Privacy Policy.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  6. Service Modifications and Termination
                </h2>
                <h3 className="text-lg font-semibold text-gray-700">
                  Modifications
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  We may modify or discontinue parts or all of the App at any time. Significant changes will be
                  communicated to you via email or in-app notifications.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Termination
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  We reserve the right to terminate or suspend your account for any violation of these Terms or
                  applicable laws. You may terminate your account at any time through your account settings.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  7. Intellectual Property
                </h2>
                <p className="text-gray-600 text-lg">
                  The App, including its features, content, and design, is protected by copyright, trademark, and other
                  intellectual property laws. You are granted no rights beyond the limited access license described in
                  these Terms.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-600 text-lg">
                  To the fullest extent permitted by law, uGem is not liable for:
                </p>
                <ul className="list-disc list-inside text-gray-600 text-lg">
                  <li>Indirect, incidental, or consequential damages.</li>
                  <li>Loss of data, revenue, or business opportunities.</li>
                  <li>Any unauthorized access to your account.</li>
                </ul>
                <p className="text-gray-600 text-lg">
                  Our total liability is limited to the amount paid by you for the service in the preceding 12 months or
                  $50, whichever is greater.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  9. Dispute Resolution
                </h2>
                <h3 className="text-lg font-semibold text-gray-700">
                  Governing Law
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  These Terms are governed by the laws of [Your Jurisdiction].
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Arbitration Agreement
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  Any disputes arising out of or relating to these Terms will be resolved through binding arbitration.
                  You waive your right to a jury trial or to participate in a class action lawsuit.
                </p>
                <h3 className="text-lg font-semibold text-gray-700">
                  Exceptions
                </h3>
                <p className="text-gray-600 text-lg mb-4">
                  You may bring claims in small claims court or seek injunctive relief for intellectual property
                  violations outside of arbitration.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  10. Changes to These Terms
                </h2>
                <p className="text-gray-600 text-lg">
                  We may update these Terms from time to time. Changes will be effective upon posting. Your continued
                  use of the App constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  11. Contact Us
                </h2>
                <p className="text-gray-600 text-lg">
                  For questions about these Terms, please contact us at:
                </p>
                <p className="text-gray-600 text-lg">
                  <strong>Email:</strong> <a href="mailto:team@ugem.app">team@ugem.app</a>
                </p>
              </section>

              <p className="text-gray-600 text-center">
                Thank you for using uGem. We are committed to providing an excellent user experience.
              </p>
            </div>
          </div>
        </main>
      </div>


  )
}

export default TermsOfService
