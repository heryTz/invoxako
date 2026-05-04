import { render, screen } from "@testing-library/react";
import { GetInvoiceById } from "../../../../invoice-service";
import { InvoicePreview } from "../invoice-preview";

const mockInvoice = {
  ref: "CLI.2024.001",
  createdAt: new Date(2024, 3, 27), // local-time constructor avoids UTC-offset date shift
  tva: 20,
  currency: "EUR",
  Provider: {
    name: "Provider",
    address: "1 rue test",
    email: "p@test.com",
    phone: "0600000000",
    nif: null,
    siren: null,
    ape: null,
  },
  Client: {
    name: "Client",
    address: "2 rue test",
    email: "c@test.com",
    phone: "0600000001",
    nif: null,
    siren: null,
    ape: null,
    entrepriseId: null,
  },
  Products: [{ name: "Service", price: 100, qte: 1 }],
  Payment: {
    name: "Virement",
    iban: "FR76...",
    bic: "BNPAFRPP",
    accountName: "Provider",
  },
} as unknown as GetInvoiceById;

describe("InvoicePreview header", () => {
  beforeEach(() => {
    render(<InvoicePreview invoice={mockInvoice} invoiceClassName="" />);
  });

  it("displays Facture as its own text node", () => {
    expect(screen.getByText("Facture")).toBeInTheDocument();
  });

  it("displays the invoice reference on its own row", () => {
    expect(screen.getByText(/Numéro : CLI\.2024\.001/)).toBeInTheDocument();
  });

  it("displays the invoice date on its own row", () => {
    expect(
      screen.getByText(/Date d'émission : 27\/04\/2024/),
    ).toBeInTheDocument();
  });
});
