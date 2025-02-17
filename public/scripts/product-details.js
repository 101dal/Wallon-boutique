document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));

            // Add active class to the clicked thumbnail
            thumbnail.classList.add('active');

            // Update the main image source
            mainImage.src = thumbnail.src;
        });
    });
});

async function createReview_request(review, rating, product_id) {
    const formData = new FormData();
    formData.append('review', review);
    formData.append('rating', rating);
    formData.append('product_id', product_id);
    const response = await fetch(`http://localhost:3000/api/v1/reviews/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    return data;
}

document.addEventListener("DOMContentLoaded", async () => {
    const review_form = document.querySelector(".review-form");

    await review_form.addEventListener("submit", async event => {
        event.preventDefault();

        const review_content = review_form.querySelector("#review").value;
        const product_id = review_form.querySelector("#product_id").getAttribute("value");

        const created_review = await createReview_request(review_content, 5, product_id);

        console.log(created_review)

        if (created_review.status === 201) {
            window.location.reload();
        } else {
            alert("Une erreur s'est produite.")
        }
    })
})