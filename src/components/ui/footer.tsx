export default function Footer() {
  return (
    <footer className="rounded-lg ">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="text-body block text-gray-500 dark:text-gray-400 sm:text-center">
          <a
            href="https://flowbite.com/"
            className="hover:underline"
            target="_blank"
            rel="noopener"
          >
            Github Repo
          </a>
        </span>
      </div>
    </footer>
  );
}
