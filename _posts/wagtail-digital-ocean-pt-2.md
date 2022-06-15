---
title: 'Deploying my Wagtail blog to Digital Ocean, pt. 2'
excerpt: 'Part 2 of my tutorial on deploying your Wagtail blog to Digital Ocean, learning a bit about Gunicorn and Nginx on the way.'
date: '2020-03-16T05:35:07.322Z'
---

<strong>You can read the first part of this post <a href="https://rosamund.dev/wagtail-digital-ocean-pt-1/">here</a>.</strong>

It’s true what they say: when you reach a goal in programming, that sense of achievement is real. It is something I’d underestimated. Coming from a “creative” background as a writer, creating work you’re proud of is quite a different feeling. Maybe it’s because you know it’s come from <em>you</em>, whereas when you get stuff right in programming, you figured something out; something that millions of people have also had to learn and get their heads around. Writing is lonely, but programming, no matter how much some may insist otherwise, is community-based.

In other words, I was elated when I got my site online. My joy was short-lived — more on that later — but I’m going to publish this post anyway.

<h3>Testing — and not</h3>

This is a topic way too broad to cover here, so I’m just going to say that the entirety of <a href="https://www.obeythetestinggoat.com/pages/book.html"><em>Obey the Testing Goat</em></a> by Harry Percival is available online for free, for your reference. It walks you through testing Django apps with Selenium.

I went back on my word and didn’t test this as extensively as I wanted to, as I was kind of in a hurry. Luckily, most stuff worked when the site went live (read on to find out what didn’t). I did have a brush with Geckodriver and I hated it. It’s recommended in the book as the webdriver communicating between Firefox and Selenium, as it was a complete pain to install… however, if you are determined to use Firefox as your browser, it’s kinda the only way. The first time I tried to add Geckodriver as an executable, I ended up breaking my bash console. (By the way, if this ever happens to you, the solution is to open .bash_profile, delete everything, and make sure the path is <code>export PATH=/bin:/usr/bin:/usr/local/bin</code>).

Here is what I ended up doing instead, <a href="https://selenium.dev/documentation/en/webdriver/driver_requirements/#adding-executables-to-your-path">with </a><a href="https://medium.com/dropout-analytics/selenium-and-geckodriver-on-mac-b411dbfe61bc">these </a><a href="https://medium.com/@sonaldwivedi/downloading-and-setting-up-geckodriver-87873e25207c">guides </a> helping me.

Go <a href="https://github.com/mozilla/geckodriver/releases">here</a> and pick your Geckodriver version to download to your local drive; if you’re using a DO server it’ll most likely be <code>geckodriver-v0.26.0-linux64.tar.gz</code> (I spent aaaaages wondering why it wasn’t working, when it turned out I’d been on autopilot and downloaded the MacOS one. Doh!) Unzip the folder and there should be a geckodriver executable file within it.

Then go to <code>/usr/local/share</code> on your Ubuntu server and create a directory called geckodriver2 (so that you don’t confuse it with the local one). Connect to FileZilla and move the <code>geckodriver</code> file to <code>geckodriver2</code>.

It’s possible you’ll get the following stack trace error: 
<code>selenium.common.exceptions.WebDriverException: Message: &#x27;geckodriver&#x27; executable may have wrong permissions</code>. 

This probably means you’ll need to change the <code>PATH</code> in the <code>.bash_profile</code> file (Google will help you find it). After doing so, run <code>source .bash_profile</code> so the changes are applied, then test that it worked by running <code>echo $PATH</code>.

I’ve played around with Selenium within the context of parsing HTML, but I certainly have more to learn when it comes to testing. Also, the Selenium “language” is called <a href="https://www.softwaretestingmentor.com/what-is-selenese/">Selenese</a>, which sounds nice!

That’s all I have to say about testing for now!

<h3>Security</h3>

When everything is ready, don’t open the golden gates (port `80`) to internet traffic yet!!! First, run `python manage.py check --deploy`. This will give you an automated list of security issues you need to rectify before you deploy.

Django offers its own <a href="https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/">deployment checklist</a>, or you can refer to this more <a href="https://dev.to/coderasha/django-web-security-checklist-before-deployment-secure-your-django-app-4jb8">beginner-friendly one</a>, which spells out some of the security warnings you will see when you run the command above. Among other warnings, I solved <code>W004</code>, <code>W006</code>, <code>W007</code>, and <code>W008</code> thanks to this guide. I also found that some issues with static and styling could be solved by clearing the browser cache.

Then there's the perennial question of how to deal with secret info in Django projects, such as database credentials and the <code>SECRET_KEY</code>. I made sure I had all info common to development and production in <a href="https://github.com/rosamundm/rosederwelt-blog/blob/master/mysite/mysite/settings/base.py"><code>base.py</code></a>, while private info was kept in <code>dev.py</code>, which in turn was listed in the <code>.gitignore</code>. The "public version" with concealed info, which runs in production, is therefore in <a href="https://github.com/rosamundm/rosederwelt-blog/blob/master/mysite/mysite/settings/production.py"> <code>production.py</code></a>.

Again, virtual environments are a whole 'nother topic, so I’ll just say I used the environ library. Docs<a href="https://django-environ.readthedocs.io/en/latest/"> here</a>.

<h3>Deployment</h3>

Now that your security settings are hopefully watertight, make sure you set <code>DEBUG = False</code> in your <code>production.py</code> file! This is like the code version of having lipstick on your teeth, only significantly more dangerous in terms of privacy and security.

Since I had been working on a VM but had done the bulk of the actual site creation on my local machine, I had to generate another SSH key so I could commit my project to GitHub. I ended up creating a new repo for the stuff I’d been doing on the VM, as I wanted to to keep it separate from the work I’d done which was mainly "design"-related.

After setting the DNS records for my desired domain on Digital Ocean, the next step was getting an SSL certificate — I used <a href="https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx">Certbot</a>, which is free (be sure to select the right system!). Then, as the DO documentation says, I did <code>sudo ufw delete allow 8000</code> then <code>sudo ufw allow &#x27;Nginx Full&#x27;</code> to close the development server port and open port 80.

And then the website was online at its domain, and it was good. For a while there, I didn’t think that day would come!

<h3>Work in progress</h3>

Alas, I sabotaged myself when I tried fixing something. When editing a page in the Wagtail admin and previewing it, I got a 400 error. I started to fix this by going in to the panel on the left-hand side of the admin page, clicking on <i>Settings</i>, then <i>Sites.</i>

From there, click on <em>localhost</em>. Change the number of the port (also, I don’t think it’s mandatory, but I changed the port name too for clarity). Save. Run <code>sudo systemctl restart gunicorn</code> to make sure the changes are reflected on the live site.

But then none of this mattered anyway, because soon after that, I ended up accidentally deleting half of my virtual environment! As a result, nothing would run. Unfortunately, simply deleting what was left of the environment and creating a new one didn’t have the intended effect; it messed up the paths. Now my Django and Gunicorn installations are out of whack, which I’m still trying to figure out the best way to fix.

As I keep coming back to dealing with this, the thing to remember is that I did it all on my own. Most people build products and apps in teams where different people are responsible for various parts of the process. Not everyone has the patience to stick through the frustration of doing a whole project by themselves. But I did, even when I was convinced I sucked, even when it felt like the odds were against me and none of this was going to lead me anywhere I wanted, professionally or personally.

And I want <em>more</em> of it.

(In the end, I didn't really fix the problem. I just started over on another VPS and luckily had up-to-date versions of my work on GitHub.)
