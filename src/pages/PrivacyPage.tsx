import { LegalPage } from "@/components/shared/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="24 October 2026"
      intro="BuyCars is a marketplace where individuals list their own cars and buyers contact them directly. This policy explains what we store, why, and who can see it."
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>
                When you sign in with Google we receive your name, email address, profile photo and
                a unique identifier from Google. You may optionally add a phone number and city to
                your profile.
              </p>
              <p>
                When you list a car we store the vehicle details you enter, the photos you upload,
                and your city. When you message a seller we store that message alongside the listing
                it refers to.
              </p>
            </>
          ),
        },
        {
          heading: "What is public and what is not",
          body: (
            <p>
              Your listing's vehicle details, photos, city and first name are visible to anyone
              browsing the marketplace. Your email address and phone number are never published.
              Contact details are only shared if you choose to include them in a message or reply to
              a buyer yourself.
            </p>
          ),
        },
        {
          heading: "Where data lives",
          body: (
            <p>
              Sign-in is handled by Firebase Authentication, which stores your account record in
              Google Cloud; we never see or store your Google password. Listings, saved cars and
              messages are not live in this preview. When they ship, they will be stored in Google
              Cloud Firestore and vehicle photographs on Cloudinary.
            </p>
          ),
        },
        {
          heading: "Session persistence",
          body: (
            <p>
              Firebase keeps you signed in after a page refresh by storing a signed token in your
              browser's local storage. Signing out removes it. Clearing site data has the same
              effect.
            </p>
          ),
        },
        {
          heading: "Retention and deletion",
          body: (
            <p>
              You can archive or delete any listing you own at any time; deleted listings stop
              appearing in search immediately. Deleting your account removes your profile, listings
              and saved cars. Messages retained for the other party's records are anonymised rather
              than removed, so the seller keeps a legitimate record of an enquiry made about their
              car.
            </p>
          ),
        },
        {
          heading: "Reporting and moderation",
          body: (
            <p>
              Anyone can flag a listing. Reports are reviewed by a BuyCars administrator, who may
              archive a listing and record that action in an internal audit log. We do not inspect
              vehicles, verify ownership documents, or confirm the accuracy of a seller's
              description.
            </p>
          ),
        },
        {
          heading: "Payments",
          body: (
            <p>
              BuyCars does not process payments and holds no financial data. Any deposit, transfer
              or escrow is arranged directly between buyer and seller, and is entirely their
              responsibility.
            </p>
          ),
        },
        {
          heading: "Children",
          body: (
            <p>
              The marketplace is not directed at people under 18, and we do not knowingly accept
              registrations from them.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about this policy, or requests to access or delete your data, go to{" "}
              <a
                className="font-medium text-brand underline decoration-brand/30 hover:text-brand-hover"
                href="mailto:privacy@buycars.example"
              >
                privacy@buycars.example
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
