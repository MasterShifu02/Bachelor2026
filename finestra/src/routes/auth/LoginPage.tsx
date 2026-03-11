import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom';


export function LoginPage() {
    return (
        <main>
            <h1>placeholder for LoginPage </h1>
            
            <Button asChild>
                <Link to="/dashboard">Knappen til Trym</Link>
             </Button>

        </main>
    );
}


{/* dette er auth-route */}
