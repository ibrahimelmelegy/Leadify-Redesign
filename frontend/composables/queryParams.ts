export default function useQuery(currentPage: Ref<number>, sort: Ref<string>, filters: Ref<any>, search: Ref<string>) {
  const {
    currentPage: currentPageRef,
    sort: sortRef,
    filters: filtersRef,
    search: searchRef,
  } = toRefs({
    currentPage,
    sort,
    filters,
    search,
  });

  const router = useRouter();
  const route = useRoute();

  onMounted(async () => {
    currentPageRef.value = route.query?.pageNumber ? Number(route.query?.pageNumber) : currentPageRef.value;
    searchRef.value = route.query?.find ? route.query?.find : searchRef.value;
    sortRef.value = route.query?.sortOption ? decode(route.query?.sortOption || {}) : sortRef.value;
    filtersRef.value = route.query?.filterOptions ? decode(route.query?.filterOptions || {}) : filtersRef.value;
  });

  function decode(value: Object) {
    try {
      const data = JSON.parse(decodeURIComponent(value));
      return data;
    } catch (e) {
      return '';
    }
  }

  watch(currentPageRef, (curr) => {
    router.push({
      path: route.fullPath,
      query: { ...route.query, pageNumber: curr },
    });
  });

  let timer: any;
  watch(searchRef, (curr) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      router.push({
        path: route.fullPath,
        query: { ...route.query, find: curr },
      });
    }, 500);
  });
  watch(sortRef, (curr) => {
    router.push({
      path: route.fullPath,
      query: { ...route.query, sortOption: encodeURIComponent(JSON.stringify(curr || '')) },
    });
  });

  watch(filtersRef, (curr) => {
    router.push({
      path: route.fullPath,
      query: { ...route.query, filterOptions: encodeURIComponent(JSON.stringify(curr || '')) },
    });
  });

  return {
    currentPage: currentPageRef,
    sort: sortRef,
    filters: filtersRef,
    search: searchRef,
  };
}
