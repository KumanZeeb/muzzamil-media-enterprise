interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { question: 'Is there a guarantee? / Ada jaminan?', answer: 'Yes, 7 days guarantee for account access issues (except TOS violation). Kami bantu rollback atau refund ikut kes.' },
  { question: 'Payment methods? / Cara pembayaran?', answer: 'Dana, GoPay, OVO, Bank Transfer. Invoice & payment proof must be sent to admin WA.' },
  { question: 'How is account delivered? / Cara serah akun?', answer: 'After payment confirmation, we send account details via chat (WA/Discord). Proses biasanya < 60 minit untuk stok ready.' },
  { question: 'Can negotiate price? / Boleh nego harga?', answer: 'For bulk purchase or more than 1 account, boleh bincang dengan admin.' },
];

export default function FAQList() {
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={i} className="faq-item">
          <summary>{f.question}</summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  )
}
