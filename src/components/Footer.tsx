import { Link } from 'react-router';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            For those who had a busy day ✨
          </p>
          <p className="text-xs text-muted-foreground">
            Built by{' '}
            <a 
              href="https://dirathea.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              dirathea
            </a>
            {' '}from Berlin with 🧡 {currentYear}
          </p>
          <p className="text-xs text-muted-foreground">
            <Link 
              to="/about" 
              className="underline hover:text-foreground transition-colors"
            >
              Why I built this?
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
