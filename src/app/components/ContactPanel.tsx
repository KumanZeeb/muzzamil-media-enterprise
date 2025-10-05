'use client'

import { FC } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeadset, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp, faTiktok, faFacebook } from "@fortawesome/free-brands-svg-icons"

const ContactPanel: FC = () => {
  return (
    <div className="panel contact-panel" id="kontak">
      <h3>
        <FontAwesomeIcon icon={faHeadset} /> Contact Admin / Hubungi Admin
      </h3>

      <p className="muted">
        Need quick help? Click button below to chat WA or send email. / Butuh
        bantuan cepat? Klik tombol di bawah untuk chat WA atau email.
      </p>

      <div className="contact-buttons">
        <a
          className="btn btn-primary"
          href="https://wa.me/60178031775"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faWhatsapp} /> Chat WA
        </a>

        <a
          className="btn btn-outline"
          href="https://www.tiktok.com/@muzzkuzz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faTiktok} /> TikTok
        </a>

        <a
          className="btn btn-outline"
          href="https://www.facebook.com/epolstock"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faFacebook} /> Facebook
        </a>
      </div>

      <div className="security-note">
        <FontAwesomeIcon icon={faInfoCircle} /> Make sure to contact only
        official contacts listed on this website to avoid scams. / Pastikan
        hanya menghubungi kontak resmi di website ini untuk elak penipuan.
      </div>
    </div>
  )
}

export default ContactPanel