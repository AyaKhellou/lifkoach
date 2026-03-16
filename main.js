const projectId = "ul6wfu5e"
const dataset = "production"

const query = encodeURIComponent(`
  *[_type == "post"]{
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage{
        asset->{
            url
        }
    }
}
`)

const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`

async function fetchPosts() {
    const res = await fetch(url)
    const data = await res.json()
    renderPosts(data.result)
}

function renderPosts(posts) {
    const container = document.getElementById("blog-container")
    
    posts.forEach(post => {
        container.innerHTML += `
            <div class="blog w-125 min-w-75 h-112 cursor-pointer" data-aos="zoom-in" onclick="window.location.href='blog.html?slug=${post.slug.current}'">
                <img 
                width="500px"
                height="200px"
                src="${post.mainImage?.asset?.url}" 
                class="max-w-full h-auto aspect-1/0.75 object-cover"/>
                <div class="p-6">
                    <h3 class="heading-3">${post.title}</h3>
                    <p class="date description flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-secondary-writing-color stroke-background-color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                        ${post.publishedAt.slice(0,10)}
                    </p>
                </div>
            </div>
        `
    })
}

fetchPosts()
