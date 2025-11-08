import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-lg shadow-lg relative"
    >
      <Quote size={40} className="absolute top-6 left-6 text-beige opacity-30" />
      
      <div className="relative z-10">
        {/* Text */}
        <p className="text-gray-700 mb-6 italic leading-relaxed">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="border-t border-gray-200 pt-4">
          <p className="font-semibold text-gray-900">{testimonial.author}</p>
          {testimonial.service && (
            <p className="text-sm text-green">{testimonial.service}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;

