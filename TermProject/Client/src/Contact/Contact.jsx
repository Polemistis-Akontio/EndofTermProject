import './Contact.css'

const Contact = () => {
    return (
        <div className="contact-container">
            <h2>Contact Us! </h2>
            <form className="contact-form">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your Name" />
    
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your Email" />
    
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" placeholder="Your Message"></textarea>
    
                <button type="submit" className="contact-button">Send</button>
            </form>
        </div>
    );
};

export default Contact;