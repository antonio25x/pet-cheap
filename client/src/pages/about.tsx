import { Check } from "lucide-react";

export default function About() {
  return (
    <section className="py-16 min-h-screen" data-testid="about-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-testid="text-about-title"
            >
              About Pet Cheap
            </h1>
            <p
              className="text-xl text-muted-foreground"
              data-testid="text-about-subtitle"
            >
              Your trusted partner in pet care since 2024
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Pet store owner with happy pets"
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-about-hero"
              />
            </div>
            <div>
              <h2
                className="text-2xl font-semibold mb-6"
                data-testid="text-mission-title"
              >
                Our Mission
              </h2>
              <p
                className="text-muted-foreground mb-6 leading-relaxed"
                data-testid="text-mission-description"
              >
                At Pet Cheap, we believe every pet deserves the best care
                without breaking the bank. Founded by passionate pet owners,
                we're committed to providing high-quality pet supplies at
                affordable prices.
              </p>
              <p
                className="text-muted-foreground mb-6 leading-relaxed"
                data-testid="text-mission-details"
              >
                Our carefully curated selection includes only products we'd use
                for our own furry family members. From nutrition to
                entertainment, we've got everything your pets need to live their
                best lives.
              </p>

              <div className="space-y-4" data-testid="mission-points">
                <div
                  className="flex items-center space-x-3"
                  data-testid="point-quality"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    Quality products at unbeatable prices
                  </span>
                </div>
                <div
                  className="flex items-center space-x-3"
                  data-testid="point-support"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    Expert pet care advice and support
                  </span>
                </div>
                <div
                  className="flex items-center space-x-3"
                  data-testid="point-shipping"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    Fast, reliable shipping nationwide
                  </span>
                </div>
                <div
                  className="flex items-center space-x-3"
                  data-testid="point-guarantee"
                >
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">
                    100% satisfaction guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
