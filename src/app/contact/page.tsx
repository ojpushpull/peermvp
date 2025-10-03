export default function ContactPage(){
    return (
        
        <div>
            <h1>Contact</h1>
            <p>This website is a brand new venture with the goal of becoming recognized as a well known resource used by peers 
                regularly to make their lives easier. I want to hear what you have to say let us know we are doing right, can do better,
                and everything in between. Get in touch Im looking forward to talking.
            </p>
        
        <div className="bg-blue-50 p-6 rounded-lg">
            <form>
                <label> name:</label> <input type="text" />
                <label> email:</label> <input type="email" />
                <label> message:</label> <textarea />
                <button type="submit">Submit</button>
            </form>
        
        <div>
            <h3> Email: hi@nycpeerguide.com </h3>
        </div>    
      </div>
    </div>

    );
}