import { Mail, MapPin, Phone } from "lucide-react";

function HomeContactUs(): JSX.Element {
  return (
    <section className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="rounded-[1.1rem] bg-[#4e060f] p-7 text-[#fff4f4] sm:p-9">
        <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#ffc9d5]">
          Contact Us
        </p>

        <p className="mt-3 max-w-[28rem] font-['Playfair_Display',serif] text-[1.8rem] font-[400] leading-[1.02] sm:text-[2.4rem]">
          Need help choosing the right ritual or placing an order?
        </p>

        <p className="mt-4 max-w-[30rem] text-[0.88rem] font-[300] leading-[1.8] text-[#ffe4e9] sm:text-[0.92rem]">
          Reach out for product guidance, gifting help, or order questions. We
          kept this section simple and editorial so it fits the rest of the
          homepage.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[1.1rem] bg-[#fff0f2] p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8c1d40]">
              <Mail className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.22em] text-[#8c1d40]">
                Email
              </p>
              <p className="mt-1 break-words text-[0.86rem] font-[400] text-[#34171f] sm:text-[0.92rem]">
                concierge@skinandsilk.com
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.1rem] bg-[#fff7f8] p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8c1d40]">
              <Phone className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.22em] text-[#8c1d40]">
                Phone
              </p>
              <p className="mt-1 text-[0.92rem] font-[400] text-[#34171f]">
                +1 (415) 555-0188
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.1rem] bg-[#fff0f2] p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8c1d40]">
              <MapPin className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.22em] text-[#8c1d40]">
                Studio Hours
              </p>
              <p className="mt-1 text-[0.92rem] font-[400] text-[#34171f]">
                Mon - Fri, 9 AM - 6 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeContactUs;
