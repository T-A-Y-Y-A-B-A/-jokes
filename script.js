document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const jokeText = document.getElementById("joke-text")
  const jokeDelivery = document.getElementById("joke-delivery")
  const loader = document.getElementById("loader")
  const errorMessage = document.getElementById("error-message")
  const newJokeBtn = document.getElementById("new-joke-btn")
  const likeBtn = document.getElementById("like-btn")
  const categoryBtns = document.querySelectorAll(".tab-btn")
  const currentCategoryBadge = document.getElementById("current-category")

  // State
  let currentCategory = "Any"
  let isLoading = false
  let isLiked = false

  // Initialize
  fetchJoke()

  // Event Listeners
  newJokeBtn.addEventListener("click", fetchJoke)

  likeBtn.addEventListener("click", () => {
    isLiked = !isLiked
    if (isLiked) {
      likeBtn.classList.add("liked")
      likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked!'
    } else {
      likeBtn.classList.remove("liked")
      likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Like'
    }
  })

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category")
      if (category !== currentCategory) {
        currentCategory = category
        currentCategoryBadge.textContent = category

        // Update active button
        categoryBtns.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")

        // Fetch new joke
        fetchJoke()
      }
    })
  })

  // Functions
  function fetchJoke() {
    if (isLoading) return

    // Reset state
    setLoading(true)
    resetLike()
    hideError()

    const xhr = new XMLHttpRequest()
    const url =
      currentCategory === "Any"
        ? "https://jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
        : `https://jokeapi.dev/joke/${currentCategory}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit`

    xhr.open("GET", url, true)

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          if (response.error) {
            showError(response.message || "Failed to fetch joke")
          } else {
            displayJoke(response)
          }
        } catch (e) {
          showError("Failed to parse response")
        }
      } else {
        showError("Failed to fetch joke")
      }
      setLoading(false)
    }

    xhr.onerror = () => {
      showError("Network error occurred")
      setLoading(false)
    }

    xhr.send()
  }

  function displayJoke(joke) {
    if (joke.type === "single") {
      jokeText.textContent = joke.joke
      jokeDelivery.classList.add("hidden")
    } else {
      jokeText.textContent = joke.setup
      jokeDelivery.textContent = joke.delivery
      jokeDelivery.classList.remove("hidden")
    }
  }

  function setLoading(loading) {
    isLoading = loading
    if (loading) {
      loader.classList.remove("hidden")
      jokeText.classList.add("hidden")
      jokeDelivery.classList.add("hidden")
      newJokeBtn.disabled = true
    } else {
      loader.classList.add("hidden")
      jokeText.classList.remove("hidden")
      newJokeBtn.disabled = false
    }
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.remove("hidden")
    jokeText.classList.add("hidden")
    jokeDelivery.classList.add("hidden")
  }

  function hideError() {
    errorMessage.classList.add("hidden")
  }

  function resetLike() {
    isLiked = false
    likeBtn.classList.remove("liked")
    likeBtn.innerHTML = '<i class="fas fa-thumbs-up"></i> Like'
  }
})

