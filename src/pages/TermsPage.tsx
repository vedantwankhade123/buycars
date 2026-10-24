import { LegalPage } from "@/components/shared/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="24 October 2026"
      intro="By using BuyCars you agree to these terms. They are written plainly because the marketplace itself is simple: sellers list cars, buyers ask about them, and the two arrange everything else between themselves."
      sections={[
        {
          heading: "Who BuyCars is",
          body: (
            <p>
              BuyCars is a listing platform. We are not a dealer, broker, agent or party to any
              sale. We do not take possession of vehicles, set prices, arrange finance or insurance,
              or transfer ownership documents.
            </p>
          ),
        },
        {
          heading: "Your account",
          body: (
            <p>
              You must sign in with your own Google account and keep your details accurate. One
              person may browse without an account; listing a car or contacting a seller requires
              one. You are responsible for activity that happens under your account.
            </p>
          ),
        },
        {
          heading: "Listing rules",
          body: (
            <>
              <p>
                You may only list a vehicle you are authorised to sell. Each listing must be real,
                accurately described, and accompanied by photographs of that specific vehicle.
              </p>
              <p>
                Prohibited: vehicles you do not have the right to sell, cloned or stock photographs
                used to misrepresent a car, tampered odometer readings, undisclosed accident or
                flood history, financing you have not disclosed, and listings that exist to harvest
                enquiries for other businesses.
              </p>
            </>
          ),
        },
        {
          heading: "No verification",
          body: (
            <p>
              Sellers self-report every specification, condition claim and document status. BuyCars
              does not inspect vehicles, run RC or insurance checks, confirm ownership, or verify
              that a car exists. Any badge on a listing reflects metadata such as recency or price
              relative to comparable listings — never a statement about condition. Inspect the car
              yourself and have it evaluated by a mechanic you engage before paying anything.
            </p>
          ),
        },
        {
          heading: "Payments and paperwork",
          body: (
            <p>
              All money and documentation moves directly between buyer and seller. We strongly
              recommend a physical inspection, a test drive, verification of the registration
              certificate against the chassis and engine numbers, an RTO transfer of ownership, and
              payment only against documents you have seen.
            </p>
          ),
        },
        {
          heading: "Contacting sellers",
          body: (
            <p>
              Enquiries are for the purpose of buying, selling or inspecting the specific vehicle
              they relate to. Unsolicited marketing, resale of contact data, and contacting a seller
              about an unrelated vehicle are not permitted.
            </p>
          ),
        },
        {
          heading: "Content licence",
          body: (
            <p>
              You keep ownership of your photos and text. Granting us a non-exclusive licence to
              display them on BuyCars is limited to operating and promoting the marketplace, and
              ends when you delete the listing.
            </p>
          ),
        },
        {
          heading: "Suspension and removal",
          body: (
            <p>
              We may archive a listing or suspend an account that breaches these terms, is reported
              repeatedly, or exposes us or users to legal risk. Genuine mistakes are appealable by
              email; we will explain the reason.
            </p>
          ),
        },
        {
          heading: "Liability",
          body: (
            <p>
              The service is provided without warranty that it will be uninterrupted or error-free.
              To the extent permitted by law, BuyCars is not liable for losses arising from a
              transaction between a buyer and a seller, or from reliance on listing content.
            </p>
          ),
        },
        {
          heading: "Governing law",
          body: (
            <p>
              These terms are governed by the laws of India. Disputes are subject to the exclusive
              jurisdiction of courts in Bengaluru, Karnataka.
            </p>
          ),
        },
        {
          heading: "Questions",
          body: (
            <p>
              Write to{" "}
              <a
                className="font-medium text-brand underline decoration-brand/30 hover:text-brand-hover"
                href="mailto:legal@buycars.example"
              >
                legal@buycars.example
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
