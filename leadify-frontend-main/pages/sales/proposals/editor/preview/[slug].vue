<template lang="pug">
.main
  .proposal
    .proposal-content(ref="captureRef")
      .proposal-content-pages.is-intro
        .proposal-content-pages-info
          .proposal-content-pages-info-data
            p.subtitle Reference: #[span(style="color: rgb(96, 58.4, 204); font-weight: lighter") {{ proposalDetails?.reference }}]
            p.subtitle Version: #[span(style="color: rgb(96, 58.4, 204); font-weight: lighter") {{ proposalDetails?.version }}]
            h1(
              style="font-weight: 500; color: gray; margin: 1px; font-size: xxx-large"
            ) {{proposalDetails?.type  == "MIXED"  ? 'Tech & Financial' : proposalDetails?.type}}
            h1(
              style="font-weight: lighter; color: rgb(96, 58.4, 204); margin: -20px 1px 1px 1px; font-size: xxx-large"
            ) PROPOSAL
            p.subtitle(style="font-weight: lighter; margin: 0px 1px") PRESENTED TO:
            img(
              style="margin-top: 10px",
              :src="`https://staging-api.hp-tech.com/assets/${proposalDetails?.companyLogo}`"
            )
            p.subtitle For: #[span(style="color: rgb(96, 58.4, 204); font-weight: lighter"  class="mt-[40px]") {{ proposalDetails?.proposalFor }}]
        .proposal-content-pages-shape
          img(src="/images/pdf-shape.png")
        .proposal-content-pages-shape2
          img(src="/images/pdf-shape-2.png")
        .proposal-content-pages-shape3
         a(href="https://www.hp-tech.com" class="mt-[40px] text-primary-purple-500" ) www.hp-tech.com  
  div(v-html="content[1]")
  .table(v-if="tableContent?.family && tableContent?.family.length >0" style="padding : 10mm 15mm ;top:600mm")
   ProposalTableOfContents(:proposalDetails ="proposalDetails"  :table="tableContent?.family" )
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { markRaw } from "vue";
definePageMeta({
  layout: "proposal",
});

const route = useRoute();
const proposalDetails = ref<any>({});
const tableContent = ref<any>({ title: [], subtitle: [], family: [] });
const content = ref<(string | { template: unknown; props: Record<string, unknown> })[]>(
  []
);

const fetchProposal = async () => {
  try {
    proposalDetails.value = await getProposal(route.params.slug);
    proposalDetails.value?.content;
    content.value = [
      `<div contenteditable="false">
        <div class="flex align-center justify-between">
          <div class="appLogo"><img class="w-[120px]" src="/images/Logo.png" alt="Logo" /></div>
          <div class="proposal-info">
            <p class="text-sm text-gray-400 font-medium mb-2">
              Reference: <span class="text-black">${proposalDetails?.value?.reference}</span>
            </p>
            <p class="text-sm text-gray-400 font-medium mb-4">
              Version: <span class="text-black">${proposalDetails?.value?.version}</span>
            </p>
          </div>
        </div>
      </div>
      <br />
      `,
      markRaw(proposalDetails?.value?.content),
    ];
  } catch (error) {
    console.error("Error fetching proposal:", error);
  }
};

onMounted(async () => {
  await fetchProposal();
});

// Watch content changes to manage undo/redo history
watch(content, (newVal: any) => {
  nextTick(() => {
    let number = 2;
    document.querySelectorAll(".page").forEach((page, index: number) => {
      if (page.getAttribute("data-content-idx") == "2") {
        page.style.backgroundColor = "white";
        page.style.zIndex = "-1";
        page.style.left = "20%";
        page.style.top = " 300mm";
        page.style.margin = "10px";
      }

      if (
        page.getAttribute("data-content-idx") &&
        page.getAttribute("data-content-idx") != "2"
      ) {
        page.style.backgroundColor = "white";
        page.style.zIndex = "-1";
        page.style.left = "20%";
        page.style.top = "calc(" + Number(number) * 300 + "mm)";
        page.style.margin = "10px";
        number += 1;
      }
    });
    document.querySelectorAll(".overlay").forEach((page, index: number) => {
      if (index > 0) page.style.top = "calc(" + (Number(index) + 1) * 300 + "mm)";
      page.style.left = "20%";
      //page.style.display = "none";
    });
    const parents: NodeListOf<HTMLElement> = document.querySelectorAll("#titleEdit");
    parents.forEach((parent, index) => {
      const nextElement = parent?.nextElementSibling as HTMLElement | null;
      const textContent: string = Array.from(parent?.childNodes ?? [])
        .filter(
          (node) =>
            node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE
        )
        .map((node) => node?.textContent ?? "")
        .filter((text) => text?.trim().length > 0)
        .join(" ");
      if (parent.getAttribute("dataset-content-idx") !== "2")
        tableContent.value.title = [
          ...(tableContent.value?.title ?? []),
          {
            page: parent.getAttribute("dataset-content-idx"),
            value: textContent,
            next: { id: nextElement?.id, valu: nextElement?.textContent },
          },
        ];
    });
    const childrens: NodeListOf<HTMLElement> = document.querySelectorAll("#subtitleEdit");
    childrens.forEach((children, index) => {
      const nextElement = children?.nextElementSibling as HTMLElement | null;
      const textContent: string = Array.from(children?.childNodes ?? [])
        .filter(
          (node) =>
            node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE
        )
        .map((node) => node?.textContent ?? "")
        .filter((text) => text?.trim().length > 0)
        .join(" ");
      if (children.getAttribute("dataset-content-idx") !== "2")
        tableContent.value.subtitle = [
          ...(tableContent.value?.subtitle ?? []),
          {
            page: children.getAttribute("dataset-content-idx"),
            value: textContent,
            next: { id: nextElement?.id, valu: nextElement?.textContent },
          },
        ];
    });
    let subNew = tableContent.value.subtitle;
    tableContent.value.title?.forEach((el: any, index: number) => {
      let child = [];
      if (el?.next?.id == "subtitleEdit") {
        const indexfind = subNew?.findIndex(
          (content: any) => content.next?.id === "titleEdit"
        );

        child = indexfind !== -1 ? subNew.slice(0, indexfind + 1) : subNew; // Slice at the first
        subNew = subNew.slice(indexfind + 1);
      }
      tableContent.value.family = [
        ...(tableContent.value?.family ?? []),
        {
          parent: el,
          childs: child,
        },
      ];
    });
    if (subNew?.length > 0) {
      tableContent.value.family = [
        ...(tableContent.value?.family.slice(0, tableContent.value?.family?.length - 1) ??
          []),
        {
          parent:
            tableContent.value?.family?.[tableContent.value?.family?.length - 1]?.parent,
          childs: subNew,
        },
      ];
    }
  });
});
</script>

<style>
html {
  height: 100%;
}
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  background: rgb(248, 249, 250);
}
::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  display: none;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  border: 5px solid transparent;
  border-radius: 16px;
  background-clip: content-box;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.editor > .content > :deep(.page) > div > .page > .titleEdit {
  font-weight: 600;
  font-size: 24px;
  color: #5233a1;
  font-family: Gilroy;
  margin-bottom: 16px;
  line-height: 1.4;
  border-bottom: 4px solid #5233a1; /* This adds a line under the title */
  padding-bottom: 8px;
  display: inline-block; /* Makes the border match the text width */
}
.editor > .content > :deep(.page) > div > .page > .descriptionEdit {
  font-size: 16px;
  color: #333333;
  font-family: Gilroy;
  line-height: 1.6;
  margin-bottom: 12px;
}
.editor > .content > :deep(.page) > div > .page > .subtitleEdit {
  font-weight: 600;
  font-size: 18px;
  color: #10003a;
  font-family: Gilroy;
  margin-bottom: 12px;
  line-height: 1.4;
}
</style>

<style lang="scss" scoped>
.main {
  width: fit-content;
  min-width: 100%;
  position: relative;
}
.table {
  margin: 10px 10px 0px 10px;
  position: absolute;
  left: 20%;
  top: 300mm;
  width: 210mm;
  height: 297mm;
  background: white;
  padding: 10px;
}
.proposal {
  margin: 0px 10px 0px 10px;
  position: absolute;
  left: 20%;
  top: 10px;
  width: 210mm;
  height: 297mm;
  background: white;
  &-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-pages {
      width: 100%;
      height: 100%;
      background: #ffffff;
      box-sizing: border-box;
      position: relative;
      &-shape {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        max-width: 650px;
        z-index: 1;
        pointer-events: none;
        img {
          width: 100%;
          height: 60%;
          object-fit: cover;
        }
      }
      &-shape3 {
        position: absolute;
        top: 25px;
        left:25px;
        width: 100%;
        max-width: 650px;
        z-index: 1;
      }
      &-shape2 {
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        max-width: 320px;
        z-index: 1;
        pointer-events: none;
        img {
          width: 100%;
          height: 60%;
          object-fit: cover;
        }
      }
      &-shape1 {
        position: absolute;
        left: 20%;
        width: 100%;
        max-width: 200px;
        z-index: 1;
        pointer-events: none;
        img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }
      &-info {
        padding: 4rem 2rem;
        width: 100%;
        height: 75%;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: center;
        &-data {
          .subtitle {
            font-size: larger;
            font-weight: lighter;
            color: gray;
            margin: 1px;
          }

          img {
            width: 100%;
            max-height: 150px;
            object-fit: contain;
          }
        }
      }
      &.is-intro {
        display: flex;
        justify-content: start;
        align-items: center;
      }
    }
  }
}
</style>
