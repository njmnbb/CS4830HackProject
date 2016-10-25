# Node + Apache UFW setup
- Add `ufw reload` to `/etc/rc.local` before any other restarts related to networking.
- `ufw allow x` for ports being used.
- Add `ProxyPass /ss http://localhost:3000/` and `ProxyPassReverse /ss http://localhost:3000/` to `/etc/apache2/apache2.conf`
