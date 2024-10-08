import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Chain } from "@/models/chain";

export default function PrivacyPage() {
  return (
    <main className="flex flex-col items-center min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-4">
      <Header chain={Chain.Eth} />
      <h1 className="text-5xl font-bold pb-12 laptop:pb-24">Privacy Policy</h1>

      <p className="mb-2">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Aliquet condimentum risus risus congue euismod. Justo
        adipiscing sollicitudin laoreet consectetur suscipit. Nulla luctus per malesuada lorem; nisi porttitor orci.
        Quam hac mattis ligula proin per porta. Ad curae venenatis fames varius pulvinar magnis lectus libero.
        Vestibulum amet iaculis euismod ligula metus libero.
      </p>

      <p className="mb-2">
        Erat ligula montes ipsum sollicitudin class accumsan. Felis erat varius; porttitor ligula aptent massa.
        Ridiculus eleifend praesent maecenas ullamcorper finibus cursus lacinia nibh. Natoque id torquent vivamus
        sodales ultricies velit erat condimentum nisl. Iaculis quisque facilisi mollis blandit curae nisl. Aenean
        natoque congue primis proin curae parturient. Viverra tellus pulvinar turpis egestas torquent consectetur.
        Nostra gravida condimentum tempus magnis quisque donec etiam.
      </p>

      <p className="mb-2">
        Ut ligula donec potenti elit sem. Dis diam inceptos at sed morbi; suspendisse convallis. Facilisi maecenas
        aptent praesent pharetra potenti aliquet nunc. Sociosqu maecenas dui congue ad integer per arcu nunc. Quis elit
        eget mi posuere; sapien habitasse fames fusce. Facilisi ut finibus vivamus tellus, et sociosqu. Imperdiet magna
        dictumst sagittis fringilla id faucibus. Et rhoncus class, nibh quis auctor egestas vitae.
      </p>

      <p className="mb-2">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Aliquet condimentum risus risus congue euismod. Justo
        adipiscing sollicitudin laoreet consectetur suscipit. Nulla luctus per malesuada lorem; nisi porttitor orci.
        Quam hac mattis ligula proin per porta. Ad curae venenatis fames varius pulvinar magnis lectus libero.
        Vestibulum amet iaculis euismod ligula metus libero.
      </p>

      <p className="mb-2">
        Erat ligula montes ipsum sollicitudin class accumsan. Felis erat varius; porttitor ligula aptent massa.
        Ridiculus eleifend praesent maecenas ullamcorper finibus cursus lacinia nibh. Natoque id torquent vivamus
        sodales ultricies velit erat condimentum nisl. Iaculis quisque facilisi mollis blandit curae nisl. Aenean
        natoque congue primis proin curae parturient. Viverra tellus pulvinar turpis egestas torquent consectetur.
        Nostra gravida condimentum tempus magnis quisque donec etiam.
      </p>

      <p className="mb-2">
        Ut ligula donec potenti elit sem. Dis diam inceptos at sed morbi; suspendisse convallis. Facilisi maecenas
        aptent praesent pharetra potenti aliquet nunc. Sociosqu maecenas dui congue ad integer per arcu nunc. Quis elit
        eget mi posuere; sapien habitasse fames fusce. Facilisi ut finibus vivamus tellus, et sociosqu. Imperdiet magna
        dictumst sagittis fringilla id faucibus. Et rhoncus class, nibh quis auctor egestas vitae.
      </p>

      <Footer />
    </main>
  );
}
