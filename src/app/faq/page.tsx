
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <main className="w-6xl mx-auto px-4 py-16 flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions (FAQ)</h1>
        <Accordion type="single" collapsible className="w-6xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>Bagaimana cara melakukan pemesanan?</AccordionTrigger>
            <AccordionContent>Pilih produk yang diinginkan, klik "Beli Sekarang", lalu ikuti instruksi untuk menyelesaikan pembayaran.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Metode pembayaran apa saja yang tersedia?</AccordionTrigger>
            <AccordionContent>Kami menerima transfer bank, e-wallet, kartu kredit, dan pembayaran di tempat (COD) untuk area tertentu.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Bagaimana cara melacak pesanan saya?</AccordionTrigger>
            <AccordionContent>Setelah pesanan dikirim, Anda akan menerima email berisi nomor resi dan link pelacakan.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Apakah bisa retur atau tukar barang?</AccordionTrigger>
            <AccordionContent>Bisa, silakan hubungi layanan pelanggan kami maksimal 7 hari setelah barang diterima untuk proses retur atau tukar.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Bagaimana cara menghubungi customer service?</AccordionTrigger>
            <AccordionContent>Anda dapat menghubungi kami melalui email support@ecommerce.com atau WhatsApp di 0812-3456-7890.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
