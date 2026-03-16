const projectId = "ul6wfu5e"
const dataset = "production"

const params = new URLSearchParams(window.location.search)
const slug = params.get("slug")

const query = encodeURIComponent(`
  *[_type == "post" && slug.current == "${slug}"][0]{
    title,
    body,
    mainImage{
      asset->{url}
    }
  }
`)

const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`

async function fetchPost() {
  const res = await fetch(url)
  const data = await res.json()
  renderPost(data.result)
}

function renderPortableText(blocks) {
  let html = ""
  let currentList = null

  blocks.forEach(block => {

    // TEXT BLOCKS
    if (block._type === "block") {
      const text = block.children.map(child => {
        let content = child.text

        if (child.marks?.includes("strong")) {
          content = `<strong class="text-writing-color">${content}</strong>`
        }

        if (child.marks?.includes("em")) {
          content = `<em>${content}</em>`
        }

        return content
      }).join("")

      // LIST ITEMS
      if (block.listItem === "bullet") {
        if (currentList !== "ul") {
          if (currentList) html += `</${currentList}>`
          html += "<ul class='list-disc ml-6 mt-4'>"
          currentList = "ul"
        }

        html += `<li class="leading-loose my-3">${text}</li>`
        return
      }

      if (block.listItem === "number") {
        if (currentList !== "ol") {
          if (currentList) html += `</${currentList}>`
          html += "<ol class='list-decimal ml-6 mt-4'>"
          currentList = "ol"
        }

        html += `<li class="leading-loose my-3">${text}</li>`
        return
      }

      if (currentList) {
        html += `</${currentList}>`
        currentList = null
      }

      // HEADINGS
      if (block.style === "h1") {
        html += `<h1 class="text-4xl font-bold mt-8">${text}</h1>`
      } 
      else if (block.style === "h2") {
        html += `<h2 class="heading-2 text-3xl my-6">${text}</h2>`
      } 
      else if (block.style === "h3") {
        html += `<h3 class="heading-3 my-6">${text}</h3>`
      } 
      else {
        html += `<p class="my-4 description leading-loose">${text}</p>`
      }
    }
  })

  if (currentList) html += `</${currentList}>`

  return html
}

function renderPost(post) {
  const container = document.getElementById("post-container")
  const intro = document.querySelector("section.intro");

  intro.innerHTML = `
    <a href="/blogs.html" class="flex items-center justify-center gap-1 font-secondary text-accent-color">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      Back to blog
    </a>
    <h2 class="heading-2 w-1/2 max-md:w-2/3 max-sm:w-full">${post.title}</h2>
  `

  const bodyHTML = renderPortableText(post.body)

  container.innerHTML = `
    <img 
    src="${post.mainImage?.asset?.url}" 
    class="w-full h-auto object-cover rounded-lg"/>

    <h2 class="heading-2 font-bold my-10 text-center">
      ${post.title}
    </h2>
    <div class="mt-6">
      ${bodyHTML}
    </div>
  `
}

fetchPost()