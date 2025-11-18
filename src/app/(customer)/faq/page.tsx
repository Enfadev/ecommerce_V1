import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="bg-background font-sans flex flex-col">
      <div className="py-16 flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions (FAQ)</h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I place an order?</AccordionTrigger>
            <AccordionContent>Select your desired product, click &quot;Buy Now&quot;, then follow the instructions to complete payment.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What payment methods are available?</AccordionTrigger>
            <AccordionContent>We accept bank transfers, e-wallets, credit cards, and cash on delivery (COD) for certain areas.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How can I track my order?</AccordionTrigger>
            <AccordionContent>After your order is shipped, you will receive an email with a tracking number and tracking link.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I return or exchange items?</AccordionTrigger>
            <AccordionContent>Yes, please contact our customer service within 7 days of receiving the item for returns or exchanges.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>How do I contact customer service?</AccordionTrigger>
            <AccordionContent>You can contact us via email at support@ecommerce.com or WhatsApp at 0812-3456-7890.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
