export default function CreatorPublicPage({
  params,
}: {
  params: { creatorSlug: string };
}) {
  return <div>Creator: {params.creatorSlug}</div>;
}

