import LegalPage, { Section, Clause, Bullets, Fill } from "../components/LegalPage";
import { LEGAL_CONFIG } from "../legalConfig";

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service & Community Agreement"
      effectiveDate={<Fill value={LEGAL_CONFIG.effectiveDate} label="Insert Effective Date" />}
    >
      {/* ── Emergency & crisis notice ───────────────────────────────── */}
      <div style={{
        background: "var(--amber-bg)",
        border: "1.5px solid #FBBF24",
        borderRadius: "var(--radius-sm)",
        padding: "1.1rem 1.3rem",
        marginBottom: "1.6rem"
      }}>
        <h2 style={{ fontSize: "1.05rem", margin: "0 0 0.6rem 0", color: "#92400E" }}>
          ⚠ Emergency & Crisis Notice
        </h2>
        <p style={{ fontWeight: 800, color: "#7C2D12", fontSize: "0.95rem", margin: "0 0 0.7rem 0" }}>
          THIS PLATFORM IS NOT A CRISIS SERVICE AND DOES NOT PROVIDE EMERGENCY INTERVENTION.
        </p>
        <p style={{ color: "#78350F", fontSize: "0.92rem", margin: "0 0 0.7rem 0" }}>
          If you are in immediate physical danger, feeling overwhelmed, or experiencing
          thoughts of self-harm, please reach out to professional services immediately.
          We are not available 24/7 and cannot deploy emergency medical services.
        </p>
        <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
          <li style={{ color: "#78350F", fontSize: "0.92rem", marginBottom: "0.4rem" }}>
            <strong>In the US &amp; Canada:</strong> Call or text 988 to reach the Suicide &amp;
            Crisis Lifeline, or text “HOME” to 741741 to connect with the Crisis Text Line.
          </li>
          <li style={{ color: "#78350F", fontSize: "0.92rem", marginBottom: "0.4rem" }}>
            <strong>In the UK:</strong> Call 111 to reach NHS mental health services, or call
            116 123 to talk to Samaritans.
          </li>
          <li style={{ color: "#78350F", fontSize: "0.92rem" }}>
            <strong>International:</strong> Please contact your country's local emergency line
            (such as 911, 999, or 112) or go to the nearest emergency room.
          </li>
        </ul>
      </div>

      {/* ── Summary of key terms ────────────────────────────────────── */}
      <Section title="Summary of Key Terms">
        <p style={{ fontStyle: "italic", fontSize: "0.9rem", marginBottom: "0.9rem" }}>
          This summary is provided for your convenience only and does not modify, limit, or
          replace the Terms below, which govern in the event of any conflict between this
          summary and the full Terms.
        </p>
        <Bullets items={[
          <><strong>Age Limit:</strong> You must be at least 13 years old to use this platform.
            Users between 13 and 17 need verified parental consent.</>,
          <><strong>Peer-Driven:</strong> This site offers peer support and volunteer
            interactions. Nobody here acts as your licensed therapist or doctor.</>,
          <><strong>Privacy Protection:</strong> Never share real names, phone numbers, social
            media handles, or locations in public forums or private messages. Keep all
            conversations on this platform.</>,
          <><strong>Moderation Policy:</strong> We rely on automated keyword filters and user
            reports. We aim to review reports within 24 hours, but this is a goal, not a
            guarantee. Trying to bypass our automated filter is prohibited and may result in a ban.</>,
          <><strong>Logs:</strong> Private chats are recorded. Administrators may review logs on a
            discretionary, best-efforts basis if a safety concern is reported — this is not a
            substitute for contacting emergency services.</>,
          <><strong>Kentucky Law:</strong> These Terms are governed by the laws of the
            Commonwealth of Kentucky.</>,
        ]} />
      </Section>

      <Section number={1} title="Acceptance of Terms">
        <Clause>
          By accessing or using our website, forums, and peer-to-peer chatting features
          (collectively, the “Service”), you agree to be bound by these Terms of Service and our
          Community Guidelines. If you do not agree to these terms, you must immediately stop
          using the Service.
        </Clause>
      </Section>

      <Section number={2} title="Eligibility and Parental Consent">
        <Clause>
          To use our Service, you must be at least 13 years old. If you are between the ages of
          13 and 17 (or the age of legal majority where you live, if different), you may only use
          this Service if:
        </Clause>
        <Bullets items={[
          <>(a) your parent or legal guardian has reviewed these Terms of Service and the
            Community Guidelines; and</>,
          <>(b) your parent or legal guardian has provided affirmative consent to your use of the
            Service through our verified parental consent process,{" "}
            <Fill value={LEGAL_CONFIG.parentalConsentProcess} label="insert parental consent process" />.</>,
        ]} />
        <Clause>
          We reserve the right to request additional verification of parental consent at any
          time, and to suspend or terminate access for any account where consent cannot be
          confirmed. We do not knowingly collect personal information from children under 13. If
          we learn that a user under 13 has created an account or provided personal information,
          we will take steps to delete that information and terminate the account in accordance
          with applicable law, including the Children's Online Privacy Protection Act (COPPA).
        </Clause>
      </Section>

      <Section number={3} title="Nature of Service (No Professional Medical Advice)">
        <Clause>
          The Service is designed to host public discussion forums and private peer-to-peer text
          interactions for peer support and volunteering. The content shared, messages exchanged,
          and advice given on this platform are user-generated and do not constitute professional
          medical, psychiatric, psychological, or clinical advice, diagnosis, or treatment.
          Volunteers are peers and are not licensed clinicians, counselors, or medical
          professionals. Always seek the advice of your physician or qualified mental health
          provider with any questions you may have regarding a medical or psychological condition.
        </Clause>
        <Clause>
          The Service is not intended to create, and does not create, a patient–provider
          relationship between you and the platform, any volunteer, or any other user. The
          platform is not a “covered entity” or “business associate” as those terms are defined
          under the Health Insurance Portability and Accountability Act of 1996 and its
          implementing regulations (HIPAA). You should not use the Service to transmit or store
          protected health information for purposes of medical diagnosis or treatment, and any
          information you choose to share is provided at your own discretion and risk.
        </Clause>
      </Section>

      <Section number={4} title="Interactive Features and User Conduct">
        <Clause>
          Our platform offers public forum posting and one-on-one private peer chatting. When
          participating in these interactive features, you strictly agree to the following rules:
        </Clause>
        <Bullets items={[
          <><strong>No Personal Identifiable Information (PII):</strong> You are completely
            prohibited from sharing phone numbers, real names, home or school addresses, email
            addresses, social media usernames, or photos of yourself or others.</>,
          <><strong>No Moving Off-Platform:</strong> You may not ask another user to continue a
            conversation on a separate application or platform (e.g., Discord, Snapchat,
            Instagram, WhatsApp, or text messaging). All peer-to-peer interactions must stay
            within our safe, logged system.</>,
          <><strong>Prohibited Content:</strong> You will not post or transmit any content that
            includes cyberbullying, harassment, hate speech, explicit language, sexual content, or
            graphic descriptions of abuse, eating disorders, or methods of self-harm.</>,
          <><strong>No Filter Circumvention:</strong> Our site uses automated keyword filters to
            catch harmful words. Intentionally bypassing, tricking, or altering spellings to sneak
            restricted phrases past the automated filters is strictly prohibited and will result
            in an immediate permanent ban.</>,
        ]} />
      </Section>

      <Section number={5} title="Moderation, Reporting, and Review Window">
        <Clause>
          We use automated keyword filters alongside a user-reporting tool to help identify
          content that may violate these Terms. We do not provide 24/7 human surveillance of
          public forums or private chats, and we do not monitor conversations in real time.
        </Clause>
        <Clause>
          Users are encouraged to use the “Report” button if they witness cyberbullying, safety
          threats, or a breach of these Terms. We make commercially reasonable efforts to review
          user-submitted reports, with a target (not guaranteed) review window of 24 hours. This
          is an operational goal, not a warranty or promise of any particular response time,
          outcome, or intervention. We are not a crisis service, do not provide emergency
          response, and undertake no obligation to intervene in any situation, including
          situations involving reported safety risks. If you or another user may be in immediate
          danger, contact emergency services or a crisis line directly — do not rely on this
          platform's reporting system for time-sensitive safety needs.
        </Clause>
        <Clause>
          Abusing or weaponizing the user-reporting system to harass other members or file false
          claims will result in immediate suspension or permanent removal of your account.
        </Clause>
      </Section>

      <Section number={6} title="System Logging and Privacy of Chats">
        <Clause>
          All conversations on the Service, including private one-on-one peer chats, are recorded
          and stored on our servers. These records are not visible to other users, but are
          accessible to platform administrators.
        </Clause>
        <Clause>
          We do not actively monitor private chat logs in real time. We reserve the right, but
          assume no obligation, to review chat logs in response to a user report, a suspected
          violation of these Terms, or a reported concern about a user's immediate safety. Any
          such review is discretionary and undertaken on a best-efforts basis; it is not a
          substitute for professional crisis intervention, and our ability to review logs promptly
          is not guaranteed. By using the Service, you acknowledge that private chats are not
          confidential in the legal sense and are subject to this logging and discretionary review.
        </Clause>
      </Section>

      <Section number={7} title="User-Generated Content License">
        <Clause>
          By posting text or media in public forums, you grant us a non-exclusive, royalty-free,
          worldwide, perpetual license to host, display, store, and distribute that content on our
          platform. We reserve the right to lock, archive, delete, or edit any public thread or
          post, without prior notice, if it is deemed non-compliant with these Terms or our
          Community Guidelines, or if it poses a safety risk to a member of our community.
        </Clause>
      </Section>

      <Section number={8} title="Limitation of Liability">
        <Clause>
          The Service is provided on an “as is” and “as available” basis without warranties of any
          kind. To the fullest extent permitted by applicable law, the platform, its founders,
          operators, directors, and volunteers shall not be liable for any direct, indirect,
          incidental, consequential, or emotional damages resulting from your use of the website,
          missed keyword filtering, delays in report auditing, or advice provided by peer
          volunteers or other users. Nothing in this section is intended to limit liability for
          gross negligence, willful misconduct, or fraud, or for any liability that cannot be
          limited or excluded under applicable law.
        </Clause>
      </Section>

      <Section number={9} title="Governing Law and Dispute Resolution">
        <Clause>
          These Terms and any dispute arising out of or relating to the Service shall be governed
          by the laws of the Commonwealth of Kentucky, without regard to its conflict-of-laws
          principles.
        </Clause>
        <Clause>
          You and the platform agree that the exclusive venue for any dispute arising out of or
          relating to these Terms or the Service shall be the state or federal courts located in{" "}
          <Fill value={LEGAL_CONFIG.venueCounty} label="insert county" />, Kentucky, and each
          party consents to personal jurisdiction there.
        </Clause>
        <Clause>
          To the fullest extent permitted by applicable law, any dispute must be brought on an
          individual basis only, and not as a plaintiff or class member in any purported class,
          collective, or representative action. This Section does not require arbitration of any
          dispute; it governs the choice of law, venue, and the manner in which claims may be
          brought.
        </Clause>
      </Section>

      <Section number={10} title="Termination of Use">
        <Clause>
          We reserve the right, without warning or liability, to restrict, suspend, or permanently
          terminate your access to public forums, private chats, or your entire account if we
          determine, in our sole discretion, that you have violated these Terms or pose a safety
          risk to our online community.
        </Clause>
      </Section>

      <Section number={11} title="Miscellaneous">
        <Bullets items={[
          <><strong>Modification of Terms:</strong> We may update these Terms from time to time.
            We will provide notice of material changes by{" "}
            <Fill value={LEGAL_CONFIG.changeNoticeMethod} label="insert notice method" />, and
            your continued use of the Service after the effective date of any changes constitutes
            acceptance of the revised Terms.</>,
          <><strong>Severability:</strong> If any provision of these Terms is found unenforceable,
            the remaining provisions will remain in full force and effect.</>,
          <><strong>Entire Agreement:</strong> These Terms, together with our Community Guidelines
            and Privacy Policy, constitute the entire agreement between you and the platform
            regarding the Service.</>,
          <><strong>No Waiver:</strong> Our failure to enforce any right or provision of these
            Terms will not be considered a waiver of that right or provision.</>,
          <><strong>Assignment:</strong> We may assign these Terms, in whole or in part, at any
            time without notice. You may not assign your rights or obligations under these Terms
            without our prior written consent.</>,
        ]} />
      </Section>
    </LegalPage>
  );
}
