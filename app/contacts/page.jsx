import Contacts from "../../src/views/Contacts.jsx";
import StructuredData from "../../src/components/StructuredData.jsx";
import { buildMetadata } from "../../src/seo/metadata.js";
import { buildContactPageSchema } from "../../src/seo/structured-data.js";

export const metadata = buildMetadata({
  title: "Contact Blogscape",
  description:
    "Contact the Blogscape team for publishing questions, collaborations, and editorial inquiries.",
  path: "/contacts",
  keywords: ["contact blog platform", "editorial contact page", "publishing inquiries"],
});

export default function ContactsPage() {
  return (
    <>
      <StructuredData data={buildContactPageSchema()} />
      <Contacts />
    </>
  );
}
