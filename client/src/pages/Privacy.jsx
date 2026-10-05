import LegalPage, { Section, Clause, Bullets, Fill } from "../components/LegalPage";
import { LEGAL_CONFIG } from "../legalConfig";

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate={<Fill value={LEGAL_CONFIG.effectiveDate} label="Insert Effective Date" />}
      intro="This policy explains what information Teen4Teen collects, how it is used, who can
             see it, and the choices you have. It works alongside our Terms of Service &
             Community Agreement, which govern your use of the platform."
    >
      <Section number={1} title="The short version">
        <Bullets items={[
          <>Anything you post in a public forum is <strong>public</strong> — anyone visiting the
            site can read it.</>,
          <>Private one-on-one chats are <strong>recorded and stored</strong>. Other users cannot
            see them, but platform administrators can.</>,
          <>Please <strong>never share</strong> your real name, phone number, address, email,
            social media handles, or photos in posts or chats.</>,
          <>We do not sell your information, and we do not use advertising or third-party
            analytics trackers.</>,
          <>You must be 13 or older. If you are 13–17, you need a parent or guardian's consent.</>,
        ]} />
      </Section>

      <Section number={2} title="Information you give us">
        <Clause>
          You can read the public forum without giving us anything. We collect information when
          you choose to take part:
        </Clause>
        <Bullets items={[
          <><strong>Community posts and replies:</strong> the display name you type, an optional
            country or region, a topic, and the content of your message.</>,
          <><strong>Meeting requests:</strong> your email address, an optional display name, the
            kind of support you are looking for, your preferred type of responder and meeting
            format, your general availability, and anything you write in the notes field.</>,
          <><strong>Volunteer applications:</strong> your name, email address, country or region,
            age range, whether you are a licensed or in-training mental health professional, your
            weekly availability, time zone, languages spoken, and your reason for volunteering.</>,
          <><strong>Volunteer accounts:</strong> your email address and password.</>,
          <><strong>Messages:</strong> the content of private chats with your match, and of any
            messages you exchange with an administrator.</>,
          <><strong>Practice sessions:</strong> if you apply to volunteer, the transcript of the
            AI-powered practice conversation used to evaluate your application.</>,
          <><strong>Reports:</strong> if you flag a post or reply, we record that it was flagged
            so an administrator can review it.</>,
          <><strong>Workshop sign-ups:</strong> the details you submit when you RSVP to a workshop.</>,
        ]} />
      </Section>

      <Section number={3} title="Information you should not share">
        <Clause>
          Our Terms prohibit sharing personal identifiable information anywhere on the platform.
          Please do not post or send phone numbers, real names, home or school addresses, email
          addresses, social media usernames, or photos of yourself or others — in public forums or
          in private messages. Please also keep conversations on this platform rather than moving
          to another app, so that our safety and logging protections still apply.
        </Clause>
        <Clause>
          Because Teen4Teen is a mental wellness space, what you write may touch on sensitive
          personal subjects. You decide how much to share. Please share only what you are
          comfortable having stored on our servers and read by a platform administrator under the
          circumstances described below.
        </Clause>
      </Section>

      <Section number={4} title="Public posts are public">
        <Clause>
          Posts and replies in the community forum are visible to anyone who visits the site,
          including people without an account, and may remain visible indefinitely. By posting
          text or media in public forums, you grant us a non-exclusive, royalty-free, worldwide,
          perpetual license to host, display, store, and distribute that content on our platform.
          We may lock, archive, delete, or edit any public thread or post, without prior notice,
          if it is non-compliant with our Terms or Community Guidelines, or if it poses a safety
          risk to a member of our community.
        </Clause>
      </Section>

      <Section number={5} title="Chat logging and administrator access">
        <Clause>
          All conversations on the Service, including private one-on-one peer chats, are recorded
          and stored on our servers. These records are not visible to other users, but are
          accessible to platform administrators.
        </Clause>
        <Clause>
          We do not actively monitor private chat logs in real time. We reserve the right, but
          assume no obligation, to review chat logs in response to a user report, a suspected
          violation of our Terms, or a reported concern about a user's immediate safety. Any such
          review is discretionary and undertaken on a best-efforts basis; it is not a substitute
          for professional crisis intervention, and our ability to review logs promptly is not
          guaranteed. By using the Service, you acknowledge that private chats are not
          confidential in the legal sense and are subject to this logging and discretionary review.
        </Clause>
      </Section>

      <Section number={6} title="Moderation and reports">
        <Clause>
          We use automated keyword filters alongside a user-reporting tool to help identify
          content that may violate our Terms. We do not provide 24/7 human surveillance of public
          forums or private chats, and we do not monitor conversations in real time. When you
          report content, an administrator may read the reported post, reply, or conversation in
          order to decide what action to take. We aim to review reports within 24 hours, but this
          is an operational goal, not a guarantee.
        </Clause>
      </Section>

      <Section number={7} title="How we use your information">
        <Bullets items={[
          "To run the community forum and show posts and replies.",
          "To review volunteer applications and guide approved volunteers through onboarding.",
          "To match a person requesting support with a suitable volunteer. Matching suggestions are reviewed and approved by an administrator — no match is finalized automatically.",
          "To deliver and store private chats between matched users and with administrators.",
          "To send you service emails, such as confirming a request or telling you about your application.",
          "To moderate content, respond to reports, and protect the safety of the community.",
        ]} />
      </Section>

      <Section number={8} title="Who else can see your information">
        <Clause>
          We do not sell your personal information, and we do not share it for advertising. We
          share it only with the service providers that make the platform work, and where we are
          required to by law:
        </Clause>
        <Bullets items={[
          <><strong>Supabase</strong> — stores the platform's database and account records.</>,
          <><strong>Render</strong> — hosts the website and application servers.</>,
          <><strong>Google (Gemini API)</strong> — powers the AI practice conversation used to
            evaluate volunteer applicants. What you type during a practice session is sent to
            Google to generate a reply.</>,
          <><strong>Resend</strong> — delivers our notification emails.</>,
        ]} />
        <Clause>
          We may also disclose information where we believe in good faith that we are required to
          do so by law, or where it is necessary to protect the safety of a user or another person.
        </Clause>
      </Section>

      <Section number={9} title="Children's privacy">
        <Clause>
          You must be at least 13 years old to use Teen4Teen. If you are between 13 and 17 (or the
          age of legal majority where you live, if different), you may use the Service only with
          the reviewed, affirmative consent of a parent or legal guardian, provided through our
          verified parental consent process,{" "}
          <Fill value={LEGAL_CONFIG.parentalConsentProcess} label="insert parental consent process" />.
        </Clause>
        <Clause>
          We do not knowingly collect personal information from children under 13. If we learn
          that a user under 13 has created an account or provided personal information, we will
          take steps to delete that information and terminate the account in accordance with
          applicable law, including the Children's Online Privacy Protection Act (COPPA). If you
          believe a child under 13 has given us information, please contact us at{" "}
          <a href={`mailto:${LEGAL_CONFIG.contactEmail}`}>{LEGAL_CONFIG.contactEmail}</a> and we
          will act promptly.
        </Clause>
      </Section>

      <Section number={10} title="Cookies and browser storage">
        <Clause>
          We do not use advertising cookies or third-party analytics trackers. When you sign in as
          a volunteer or administrator, we store a short-lived session token in your browser's
          session storage so that you stay signed in while you use the site. It is cleared when
          you close your browser tab or sign out.
        </Clause>
      </Section>

      <Section number={11} title="How long we keep information">
        <Clause>
          We keep information for as long as it is needed to operate the Service — for example, to
          keep the forum readable, to maintain a volunteer's record, and to be able to review a
          conversation if a safety concern is reported later. Public posts may remain visible
          indefinitely unless they are removed by you or by an administrator. You can ask us to
          delete your information using the contact details below.
        </Clause>
      </Section>

      <Section number={12} title="Your choices and requests">
        <Bullets items={[
          "You can use the public forum without creating an account.",
          "You choose what to write in a post, a chat, or a form, and how much to say.",
          "You can ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it.",
          "You can ask us to close your volunteer account at any time.",
        ]} />
        <Clause>
          To make any of these requests, email{" "}
          <a href={`mailto:${LEGAL_CONFIG.contactEmail}`}>{LEGAL_CONFIG.contactEmail}</a>. We may
          need to confirm your identity before we act, so that we do not give someone else's
          information away.
        </Clause>
      </Section>

      <Section number={13} title="Security">
        <Clause>
          We take reasonable steps to protect the information you give us, including storing
          account passwords in hashed form and restricting administrator access to a small number
          of people. No website can promise perfect security, however, and we cannot guarantee
          that information sent over the internet is completely safe. Please help protect yourself
          by choosing a strong password and by not sharing identifying details on the platform.
        </Clause>
      </Section>

      <Section number={14} title="Changes to this policy">
        <Clause>
          We may update this Privacy Policy from time to time. We will provide notice of material
          changes by{" "}
          <Fill value={LEGAL_CONFIG.changeNoticeMethod} label="insert notice method" />. Your
          continued use of the Service after the effective date of any changes means you accept
          the updated policy.
        </Clause>
      </Section>

      <Section number={15} title="Contact us">
        <Clause>
          If you have questions about this policy or about how your information is handled, email
          us at <a href={`mailto:${LEGAL_CONFIG.contactEmail}`}>{LEGAL_CONFIG.contactEmail}</a>.
        </Clause>
      </Section>
    </LegalPage>
  );
}
