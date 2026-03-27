import { motion } from "framer-motion";

export default function BotonPremium() {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000 }}
    >
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px #DAA520" }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: "linear-gradient(135deg, #0D6E6E 0%, #608B4E 100%)",
          color: "white",
          border: "none",
          padding: "15px 30px",
          borderRadius: "50px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        ADQUIRIR CÓDICE PREMIUM 
      </motion.button>
    </motion.div>
  );
}

