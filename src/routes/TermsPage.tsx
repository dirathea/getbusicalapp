import { FileText, AlertTriangle, Scale } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        <p className="text-muted-foreground">
          Last Updated: January 18, 2026
        </p>
      </div>

      {/* Important Notice */}
      <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Important Notice</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              By using BusiCal (web app or Chrome extension), you agree to these terms. 
              If you do not agree, please do not use our services.
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border rounded-lg p-6 bg-muted/30">
        <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a>
          <a href="#description" className="text-primary hover:underline">2. Description of Service</a>
          <a href="#user-responsibilities" className="text-primary hover:underline">3. User Responsibilities</a>
          <a href="#privacy" className="text-primary hover:underline">4. Privacy and Data</a>
          <a href="#disclaimers" className="text-primary hover:underline">5. Disclaimers</a>
          <a href="#limitation" className="text-primary hover:underline">6. Limitation of Liability</a>
          <a href="#intellectual-property" className="text-primary hover:underline">7. Intellectual Property</a>
          <a href="#termination" className="text-primary hover:underline">8. Termination</a>
          <a href="#changes" className="text-primary hover:underline">9. Changes to Terms</a>
          <a href="#governing-law" className="text-primary hover:underline">10. Governing Law</a>
          <a href="#contact" className="text-primary hover:underline">11. Contact Information</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        
        {/* 1. Acceptance of Terms */}
        <section id="acceptance">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            1. Acceptance of Terms
          </h2>
          <p>
            These Terms of Service ("Terms") govern your access to and use of BusiCal, including 
            our web application available at https://getbusical.app and our Chrome extension 
            (collectively, the "Service").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms and our 
            Privacy Policy. If you do not agree to these Terms, you must not use the Service.
          </p>
        </section>

        {/* 2. Description of Service */}
        <section id="description">
          <h2 className="text-2xl font-semibold">2. Description of Service</h2>
          <p>
            BusiCal provides tools to help you share calendar events between different calendar 
            platforms while maintaining privacy:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Web Application:</strong> A Progressive Web App (PWA) that allows you to 
              view your calendar events from an ICS URL and share them to other calendars 
              (Google Calendar, Outlook, or download .ics files).
            </li>
            <li>
              <strong>Chrome Extension:</strong> A browser extension that integrates with 
              Google Calendar to provide one-click sharing of calendar events to other platforms.
            </li>
          </ul>
          <p>
            The Service is designed to protect your privacy by processing all calendar data 
            locally in your browser without storing or transmitting sensitive information to 
            external servers (except for the web app's CORS proxy pass-through).
          </p>
        </section>

        {/* 3. User Responsibilities */}
        <section id="user-responsibilities">
          <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
          
          <h3 className="text-lg font-semibold mt-4">3.1. Acceptable Use</h3>
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use the Service in any way that violates applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Interfere with or disrupt the Service or servers/networks connected to the Service</li>
            <li>Use the Service to transmit malicious code, viruses, or harmful content</li>
            <li>Attempt to reverse engineer, decompile, or discover the source code (note: the Service is open source, so source code is already publicly available)</li>
            <li>Use the Service to violate the privacy rights of others</li>
            <li>Abuse or overload the CORS proxy with excessive requests</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">3.2. Calendar Provider Terms</h3>
          <p>
            When using BusiCal to access calendars from third-party providers (Google Calendar, 
            Outlook, iCloud, etc.), you must comply with their respective terms of service. 
            BusiCal is not responsible for your compliance with third-party terms.
          </p>

          <h3 className="text-lg font-semibold mt-4">3.3. Security of Your Data</h3>
          <p>
            You are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Keeping your calendar ICS URLs confidential</li>
            <li>Ensuring your browser and device are secure</li>
            <li>Managing access to your device and browser where BusiCal data is stored locally</li>
            <li>Regenerating your ICS URLs if you believe they have been compromised</li>
          </ul>
        </section>

        {/* 4. Privacy and Data */}
        <section id="privacy">
          <h2 className="text-2xl font-semibold">4. Privacy and Data</h2>
          <p>
            Your privacy is important to us. Please review our{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>{' '}
            to understand how we handle your data.
          </p>
          <p>Key points:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>All calendar data is processed locally in your browser</li>
            <li>The Chrome extension makes zero network requests - all processing is client-side</li>
            <li>The web app uses a stateless CORS proxy that does not store or log your data</li>
            <li>We do not collect personal information, analytics, or tracking data</li>
            <li>You can delete all local data at any time via browser settings</li>
          </ul>
        </section>

        {/* 5. Disclaimers */}
        <section id="disclaimers">
          <h2 className="text-2xl font-semibold">5. Disclaimers</h2>
          
          <h3 className="text-lg font-semibold mt-4">5.1. "AS IS" Basis</h3>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES 
            OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Warranties of merchantability or fitness for a particular purpose</li>
            <li>Warranties of non-infringement</li>
            <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
            <li>Warranties regarding the accuracy, reliability, or completeness of calendar data</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">5.2. No Guarantee of Availability</h3>
          <p>
            We do not guarantee that the Service will always be available, uninterrupted, or 
            free from errors. The Service may be temporarily unavailable due to maintenance, 
            updates, or technical issues.
          </p>

          <h3 className="text-lg font-semibold mt-4">5.3. Third-Party Services</h3>
          <p>
            BusiCal integrates with third-party calendar providers (Google Calendar, Outlook, 
            iCloud, etc.). We are not responsible for:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Changes to third-party APIs or services that may affect BusiCal functionality</li>
            <li>Downtime or issues with third-party calendar providers</li>
            <li>Data handling practices of third-party providers</li>
            <li>Compatibility issues with future browser or calendar provider updates</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">5.4. Calendar Synchronization</h3>
          <p>
            BusiCal facilitates sharing calendar events but does not guarantee:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>That events will be successfully created in your target calendar (this depends on the calendar provider)</li>
            <li>That event details will be accurately preserved during sharing</li>
            <li>That recurring events will be handled correctly by all calendar providers</li>
            <li>Real-time synchronization between calendars</li>
          </ul>
        </section>

        {/* 6. Limitation of Liability */}
        <section id="limitation">
          <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL BUSICAL, ITS DEVELOPERS, 
            OR CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR 
            PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Loss of data or calendar events</li>
            <li>Loss of profits or business opportunities</li>
            <li>Service interruptions or downtime</li>
            <li>Errors in calendar synchronization</li>
            <li>Unauthorized access to your calendar data</li>
            <li>Damages arising from use or inability to use the Service</li>
          </ul>
          <p>
            THIS LIMITATION APPLIES WHETHER THE ALLEGED LIABILITY IS BASED ON CONTRACT, TORT, 
            NEGLIGENCE, STRICT LIABILITY, OR ANY OTHER BASIS, EVEN IF BUSICAL HAS BEEN ADVISED 
            OF THE POSSIBILITY OF SUCH DAMAGE.
          </p>
          <p>
            IN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR 
            CONSEQUENTIAL OR INCIDENTAL DAMAGES, OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT 
            PERMITTED BY LAW.
          </p>
          <p>
            Because the Service is provided free of charge, in no event shall our total 
            liability to you exceed $0.00 USD.
          </p>
        </section>

        {/* 7. Intellectual Property */}
        <section id="intellectual-property">
          <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
          
          <h3 className="text-lg font-semibold mt-4">7.1. Open Source License</h3>
          <p>
            BusiCal is open source software licensed under the MIT License. You are free to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use the software for any purpose (personal or commercial)</li>
            <li>Modify the source code</li>
            <li>Distribute the software</li>
            <li>Create derivative works</li>
          </ul>
          <p>
            Subject to the conditions of the MIT License, including providing attribution and 
            including the license notice.
          </p>

          <h3 className="text-lg font-semibold mt-4">7.2. Trademarks</h3>
          <p>
            "BusiCal" and the BusiCal logo are trademarks of the project maintainers. Use of 
            these trademarks requires permission except as allowed under fair use.
          </p>

          <h3 className="text-lg font-semibold mt-4">7.3. Third-Party Content</h3>
          <p>
            BusiCal uses third-party libraries and services. Please refer to the project 
            repository for a complete list of dependencies and their respective licenses.
          </p>
        </section>

        {/* 8. Termination */}
        <section id="termination">
          <h2 className="text-2xl font-semibold">8. Termination</h2>
          
          <h3 className="text-lg font-semibold mt-4">8.1. By You</h3>
          <p>
            You may stop using the Service at any time. To fully terminate:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clear your browser's localStorage to remove all BusiCal data</li>
            <li>Uninstall the Chrome extension (if installed)</li>
            <li>Regenerate your calendar ICS URLs to revoke access</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">8.2. By Us</h3>
          <p>
            We reserve the right to suspend or terminate access to the Service at any time, 
            with or without notice, for any reason, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Violation of these Terms</li>
            <li>Abusive or excessive use of the CORS proxy</li>
            <li>Legal or regulatory requirements</li>
            <li>Discontinuation of the Service</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">8.3. Effect of Termination</h3>
          <p>
            Upon termination:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your right to use the Service immediately ceases</li>
            <li>All data stored locally in your browser will remain until you manually clear it</li>
            <li>Provisions of these Terms that by their nature should survive termination (including disclaimers and limitations of liability) will continue to apply</li>
          </ul>
        </section>

        {/* 9. Changes to Terms */}
        <section id="changes">
          <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective 
            immediately upon posting the updated Terms on this page with a new "Last Updated" date.
          </p>
          <p>
            Your continued use of the Service after changes are posted constitutes your acceptance 
            of the modified Terms. We encourage you to review these Terms periodically.
          </p>
          <p>
            For significant changes, we will notify users via:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>GitHub release notes</li>
            <li>Notice on the website homepage</li>
            <li>Chrome Web Store update description (for extension users)</li>
          </ul>
        </section>

        {/* 10. Governing Law */}
        <section id="governing-law">
          <h2 className="text-2xl font-semibold">10. Governing Law and Dispute Resolution</h2>
          
          <h3 className="text-lg font-semibold mt-4">10.1. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of 
            Germany, without regard to its conflict of law provisions.
          </p>

          <h3 className="text-lg font-semibold mt-4">10.2. Dispute Resolution</h3>
          <p>
            Before pursuing any formal legal action, we encourage you to contact us via 
            GitHub Issues to attempt to resolve any disputes informally.
          </p>
          <p>
            Any disputes arising out of or relating to these Terms or the Service shall be 
            subject to the exclusive jurisdiction of the courts in Berlin, Germany.
          </p>
        </section>

        {/* 11. Miscellaneous */}
        <section id="miscellaneous">
          <h2 className="text-2xl font-semibold">11. Miscellaneous</h2>
          
          <h3 className="text-lg font-semibold mt-4">11.1. Entire Agreement</h3>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement 
            between you and BusiCal regarding the Service.
          </p>

          <h3 className="text-lg font-semibold mt-4">11.2. Severability</h3>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the 
            remaining provisions shall continue in full force and effect.
          </p>

          <h3 className="text-lg font-semibold mt-4">11.3. Waiver</h3>
          <p>
            No waiver of any term of these Terms shall be deemed a further or continuing waiver 
            of such term or any other term.
          </p>

          <h3 className="text-lg font-semibold mt-4">11.4. Assignment</h3>
          <p>
            You may not assign or transfer these Terms or your rights under these Terms without 
            our prior written consent. We may assign these Terms without restriction.
          </p>

          <h3 className="text-lg font-semibold mt-4">11.5. No Professional Advice</h3>
          <p>
            The Service is not intended to provide professional advice of any kind. You should 
            consult with appropriate professionals for specific advice tailored to your situation.
          </p>
        </section>

        {/* 12. Contact Information */}
        <section id="contact">
          <h2 className="text-2xl font-semibold">12. Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>GitHub Issues:</strong>{' '}
              <a href="https://github.com/dirathea/getbusicalapp/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://github.com/dirathea/getbusicalapp/issues
              </a>
            </li>
            <li>
              <strong>GitHub Discussions:</strong>{' '}
              <a href="https://github.com/dirathea/getbusicalapp/discussions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://github.com/dirathea/getbusicalapp/discussions
              </a>
            </li>
            <li>
              <strong>Website:</strong>{' '}
              <a href="https://getbusical.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://getbusical.app
              </a>
            </li>
          </ul>
        </section>

        {/* Acknowledgment */}
        <section id="acknowledgment" className="border-t pt-6">
          <h2 className="text-2xl font-semibold">Acknowledgment</h2>
          <p>
            BY USING BUSICAL, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, 
            UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM.
          </p>
          <p className="text-sm text-muted-foreground italic">
            For those who had a busy day ✨
          </p>
        </section>

      </div>
    </div>
  );
}
