import { Datetime } from '~/components/Datetime';

const updatedDate = new Date('2024-03-01').toDateString();

export default function PrivacyPolicy() {
  return (
    <main className="prose-wrapper pb-6">
      <h1 className={'mb-10 text-4xl font-bold text-black dark:text-white'}>
        Privacy Policy
      </h1>

      <section className={'rendered-markdown'}>
        <p>
          <strong>
            Last Updated: <Datetime date={updatedDate} />
          </strong>
        </p>

        <p>
          Welcome to BenjaminCharity.com ("we," "us," "our"). We respect your
          privacy and are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, and share
          information from or about you when you visit our website hosted on
          Vercel, engage with our speed insights and analytics, and sign up for
          our services through Buttondown.
        </p>

        <h2>Collection of Information</h2>
        <h3>Information You Provide:</h3>
        <p>
          We collect information you provide directly to us when you sign up for
          our email newsletter or interact with our website. This includes your
          email address and any other information you choose to provide.
        </p>

        <h3>Information We Collect Automatically:</h3>
        <p>
          When you visit our website, we and our third-party partners, such as
          Vercel for hosting and analytics, may automatically collect certain
          information about your device and usage of our site. This includes
          your IP address, browser type, access times, and pages viewed.
        </p>

        <h2>Use of Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>
            Send you our email newsletter and other updates about our services
            if you have opted-in.
          </li>
          <li>
            Monitor and analyze trends, usage, and activities in connection with
            our website.
          </li>
          <li>Improve our website and your experience.</li>
          <li>Comply with applicable laws and regulations.</li>
        </ul>

        <h2>Sharing of Information</h2>
        <p>
          We may share your information with third-party vendors, service
          providers, and other partners who need access to such information to
          carry out work on our behalf, such as email service providers like
          Buttondown for our email newsletter. We may also share information in
          response to a request for information if we believe disclosure is in
          accordance with, or required by, any applicable law or legal process.
        </p>

        <h2>Your Choices</h2>
        <h3>Email Subscriptions:</h3>
        <p>
          You can unsubscribe from our email newsletter at any time by following
          the unsubscribe link in the emails we send or by contacting us
          directly.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last Updated" date at the top.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at ben[dot]charity@hey.com.
        </p>
      </section>
    </main>
  );
}
