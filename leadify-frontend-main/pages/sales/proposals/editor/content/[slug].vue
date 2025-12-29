<template>
  <div class="main">
    <!-- Top bar
      <VueFileToolbarMenu :content="menu" class="bar" /> -->

    <!-- Document editor -->
    <DocumentEditor
      class="editor"
      ref="editor"
      v-model:content="content"
      :overlay="overlay"
      :zoom="zoom"
      :page_format_mm="page_format_mm"
      :page_margins="page_margins"
      :display="display"
      :financeTable="proposalDetails"
      :invoiceData="{
        invoice_number: 'AB38052985',
        proposalDetails: proposalDetails,
        date: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        company: {
          name: 'Company Name',
          address: '123 Street Name',
          city: 'City',
          country: 'Country',
          phone: '+1234567890',
          email: 'email@company.com',
        },
        client: {
          name: 'Client Name',
          address: 'Client Address',
          city: 'Client City',
          country: 'Client Country',
          phone: 'Client Phone',
          email: 'client@email.com',
        },
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { markRaw } from "vue";
//   import VueFileToolbarMenu from 'vue-file-toolbar-menu';
import DocumentEditor from "~/components/DocumentEditor.vue";
import InvoiceTemplate from "~/components/InvoiceTemplate.ce.vue";
import "material-icons/iconfont/material-icons.css";
import ProposalHeader from "~/components/Proposal/Header.vue";

const editor = ref<InstanceType<typeof VueDocumentEditor> | null>(null);
const route = useRoute();
const proposalDetails = ref<any>({});
definePageMeta({
  layout: "proposal",
});

const content = ref<(string | { template: unknown; props: Record<string, unknown> })[]>(
  []
);

const fetchProposal = async () => {
  try {
    const response = await getProposal(route.params.slug);
    proposalDetails.value = {
      ...response,
      type: response?.type == "MIXED" ? "Tech & Financial" : response?.type,
    };
    content.value = [
      {
        template: markRaw(InvoiceTemplate),
        props: {
          invoice_number: "AB38052985",
          proposalDetails: proposalDetails,
        },
      },
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
      <div v-html="${proposalDetails?.value?.content}"></div>
      `,
    ];
  } catch (error) {
    console.error("Error fetching proposal:", error);
  }
};

onMounted(async () => {
  await fetchProposal();
});

// Reactive state

// const zoom = ref(0.8);
// const zoom_min = ref(0.1);
// const zoom_max = ref(5.0);
const page_format_mm = ref<[number, number]>([210, 297]);
const page_margins = ref("10mm 15mm");
const display = ref<"grid" | "vertical" | "horizontal">("vertical");
const mountedState = ref(false);
const undo_count = ref(-1);
const content_history = ref<typeof content.value>([]);
const _mute_next_content_watcher = ref(false);

// Formats and margins constants
// const formats = [
//   ['A0', 841, 1189],
//   ['A0L', 1189, 841],
//   ['A1', 594, 841],
//   ['A1L', 841, 594],
//   ['A2', 420, 594],
//   ['A2L', 594, 420],
//   ['A3', 297, 420],
//   ['A3L', 420, 297],
//   ['A4', 210, 297],
//   ['A4L', 297, 210],
//   ['A5', 148, 210],
//   ['A5L', 210, 148],
//   ['A6', 105, 148],
//   ['A6L', 148, 105],
// ] as const;

const margins = [
  ["Medium", "20mm"],
  ["Small", "15mm"],
  ["Slim", "10mm 15mm"],
  ["Tiny", "5mm"],
] as const;

// Platform flag (Mac-like devices)
const isMacLike = /Mac|iPhone|iPod|iPad/i.test(navigator.platform);

// Computed properties
const current_format_name = computed(() => {
  const format = formats.find(
    ([, w, h]) => page_format_mm.value[0] === w && page_format_mm.value[1] === h
  );
  return format
    ? format[0]
    : `${page_format_mm.value[0]}mm x ${page_format_mm.value[1]}mm`;
});

const current_margins_name = computed(() => {
  const m = margins.find(([, m]) => page_margins.value === m);
  return m ? m[0] : page_margins.value;
});

const current_text_style = computed(() => {
  return mountedState.value && editor.value ? editor.value.current_text_style : false;
});

const isLeftAligned = computed(
  () =>
    current_text_style.value &&
    ["start", "left", "-moz-left"].includes(current_text_style.value.textAlign)
);
const isRightAligned = computed(
  () =>
    current_text_style.value &&
    ["end", "right", "-moz-right"].includes(current_text_style.value.textAlign)
);
const isCentered = computed(
  () =>
    current_text_style.value &&
    ["center", "-moz-center"].includes(current_text_style.value.textAlign)
);
const isJustified = computed(
  () =>
    current_text_style.value &&
    ["justify", "justify-all"].includes(current_text_style.value.textAlign)
);
const isBold = computed(() => {
  const fontWeight = current_text_style.value?.fontWeight;
  return fontWeight && (parseInt(fontWeight) > 400 || fontWeight.indexOf("bold") === 0);
});
const isItalic = computed(() => current_text_style.value?.fontStyle === "italic");
const isUnderline = computed(() => {
  const stack = current_text_style.value?.textDecorationStack;
  return stack && stack.some((d) => d.indexOf("underline") === 0);
});
const isStrikeThrough = computed(() => {
  const stack = current_text_style.value?.textDecorationStack;
  return stack && stack.some((d) => d.indexOf("line-through") === 0);
});
const isNumberedList = computed(
  () =>
    current_text_style.value?.isList &&
    current_text_style.value?.listStyleType === "decimal"
);
const isBulletedList = computed(
  () =>
    current_text_style.value?.isList &&
    ["disc", "circle"].includes(current_text_style.value?.listStyleType)
);
const isH1 = computed(() => current_text_style.value?.headerLevel === 1);
const isH2 = computed(() => current_text_style.value?.headerLevel === 2);
const isH3 = computed(() => current_text_style.value?.headerLevel === 3);
const curColor = computed(() => current_text_style.value?.color || "transparent");

// Menu configuration using Material Icons
const createIcon = (iconName: string) =>
  h("img", {
    style: "width:40px;height:40px;",
    src: `images/pdf-icons/${iconName}.svg`,
  });

const menu = computed(() => [
  // {
  //   text: 'New',
  //   title: 'New',
  //   icon: createIcon('images/add new item.svg'),
  //   click: () => {
  //     if (confirm('This will create an empty document. Are you sure?')) {
  //       content.value = [''];
  //       resetContentHistory();
  //     }
  //   },
  // },
  {
    icon: createIcon("new-page"),
    title: "Page break",
    disabled: !current_text_style.value,
    click: () => insertPageBreak(),
  },
  { text: "Print", title: "Print", click: () => window.print() },
  {
    title: "Undo",
    icon: createIcon("undo"),
    disabled: !can_undo.value,
    hotkey: isMacLike ? "command+z" : "ctrl+z",
    click: () => undo(),
  },
  {
    title: "Redo",
    icon: createIcon("redo"),
    disabled: !can_redo.value,
    hotkey: isMacLike ? "shift+command+z" : "ctrl+y",
    click: () => redo(),
  },
  { is: "spacer" },
  {
    title: "Header 1",
    // icon: createIcon('h1'),
    icon: createIcon("title"),
    active: isH1.value,
    disabled: !current_text_style.value,
    click: () => document.execCommand("formatBlock", false, "<h1>"),
  },
  {
    // icon: createIcon('h2'),
    icon: createIcon("subtitle"),
    title: "Header 2",
    active: isH2.value,
    disabled: !current_text_style.value,
    click: () => document.execCommand("formatBlock", false, "<h2>"),
  },
  {
    // icon: createIcon('h2'),
    icon: createIcon("description"),
    title: "Header 3",
    active: isH3.value,
    disabled: !current_text_style.value,
    click: () => document.execCommand("formatBlock", false, "<h3>"),
    // menu_width: 60,
    menu: [
      {
        icon: createIcon("left"),
        title: "Align left",
        active: isLeftAligned.value,
        disabled: !current_text_style.value,
        // hotkey: isMacLike ? 'shift+command+l' : 'ctrl+shift+l',
        click: () => document.execCommand("justifyLeft"),
      },
      {
        icon: createIcon("center"),
        title: "Align center",
        active: isCentered.value,
        disabled: !current_text_style.value,
        // hotkey: isMacLike ? 'shift+command+e' : 'ctrl+shift+e',
        click: () => document.execCommand("justifyCenter"),
      },
      {
        icon: createIcon("right"),
        title: "Align right",
        active: isRightAligned.value,
        disabled: !current_text_style.value,
        // hotkey: isMacLike ? 'shift+command+r' : 'ctrl+shift+r',
        click: () => document.execCommand("justifyRight"),
      },
      {
        icon: createIcon("justify"),
        title: "Justify content",
        active: isJustified.value,
        disabled: !current_text_style.value,
        // hotkey: isMacLike ? 'shift+command+j' : 'ctrl+shift+j',
        click: () => document.execCommand("justifyFull"),
      },
      {
        icon: createIcon("ol"),
        title: "Numbered list",
        active: isNumberedList.value,
        disabled: !current_text_style.value,
        click: () => document.execCommand("insertOrderedList"),
      },
      {
        icon: createIcon("ul"),
        title: "Bulleted list",
        active: isBulletedList.value,
        disabled: !current_text_style.value,
        click: () => document.execCommand("insertUnorderedList"),
      },
    ],
  },
  // {
  //   // icon: createIcon('h2'),
  //   icon: createIcon('table'),
  //   title: 'Finance table',
  //   // active: isH4.value,
  //   disabled: !current_text_style.value,
  //   click: () => document.execCommand('formatBlock', false, '<tr>'),
  // },
  // {
  //   icon: createIcon('left'),
  //   title: 'Align left',
  //   active: isLeftAligned.value,
  //   disabled: !current_text_style.value,
  //   hotkey: isMacLike ? 'shift+command+l' : 'ctrl+shift+l',
  //   click: () => document.execCommand('justifyLeft'),
  // },
  // {
  //   icon: createIcon('center'),
  //   title: 'Align center',
  //   active: isCentered.value,
  //   disabled: !current_text_style.value,
  //   hotkey: isMacLike ? 'shift+command+e' : 'ctrl+shift+e',
  //   click: () => document.execCommand('justifyCenter'),
  // },
  // {
  //   icon: createIcon('right'),
  //   title: 'Align right',
  //   active: isRightAligned.value,
  //   disabled: !current_text_style.value,
  //   hotkey: isMacLike ? 'shift+command+r' : 'ctrl+shift+r',
  //   click: () => document.execCommand('justifyRight'),
  // },
  // {
  //   icon: createIcon('justify'),
  //   title: 'Justify content',
  //   active: isJustified.value,
  //   disabled: !current_text_style.value,
  //   hotkey: isMacLike ? 'shift+command+j' : 'ctrl+shift+j',
  //   click: () => document.execCommand('justifyFull'),
  // },
  { is: "spacer" },
  // { is: 'separator' },
  // {
  //   icon: 'format_bold',
  //   title: 'Bold',
  //   active: isBold.value,
  //   disabled: !current_text_style.value,
  //   hotkey: isMacLike ? 'command+b' : 'ctrl+b',
  //   click: () => document.execCommand('bold'),
  // },
  // {
  //   icon: 'format_italic',
  //   title: 'Italic',
  //   active: isItalic.value,
  //   disabled: !current_text_style.value,
  //   hotkey: isMacLike ? 'command+i' : 'ctrl+i',
  //   click: () => document.execCommand('italic'),
  // },
  // {
  //   icon: 'format_underline',
  //   title: 'Underline',
  //   active: isUnderline.value,
  //   disabled: !current_text_style.value,
  //   hotkey: isMacLike ? 'command+u' : 'ctrl+u',
  //   click: () => document.execCommand('underline'),
  // },
  // {
  //   icon: 'format_strikethrough',
  //   title: 'Strike through',
  //   active: isStrikeThrough.value,
  //   disabled: !current_text_style.value,
  //   click: () => document.execCommand('strikethrough'),
  // },
  // {
  //   is: 'button-color',
  //   type: 'compact',
  //   menu_class: 'align-center',
  //   disabled: !current_text_style.value,
  //   color: curColor.value,
  //   update_color: (new_color: { hex8: string }) => document.execCommand('foreColor', false, new_color.hex8),
  // },
  // { is: 'separator' },
  // {
  //   icon: 'format_list_numbered',
  //   title: 'Numbered list',
  //   active: isNumberedList.value,
  //   disabled: !current_text_style.value,
  //   click: () => document.execCommand('insertOrderedList'),
  // },
  // {
  //   icon: 'format_list_bulleted',
  //   title: 'Bulleted list',
  //   active: isBulletedList.value,
  //   disabled: !current_text_style.value,
  //   click: () => document.execCommand('insertUnorderedList'),
  // },
  // {
  //   html: '<b>H1</b>',
  //   title: 'Header 1',
  //   active: isH1.value,
  //   disabled: !current_text_style.value,
  //   click: () => document.execCommand('formatBlock', false, '<h1>'),
  // },
  // {
  //   html: '<b>H2</b>',
  //   title: 'Header 2',
  //   active: isH2.value,
  //   disabled: !current_text_style.value,
  //   click: () => document.execCommand('formatBlock', false, '<h2>'),
  // },
  // {
  //   html: '<b>H3</b>',
  //   title: 'Header 3',
  //   active: isH3.value,
  //   disabled: !current_text_style.value,
  //   click: () => document.execCommand('formatBlock', false, '<h3>'),
  // },
  // {
  //   icon: 'format_clear',
  //   title: 'Clear format',
  //   disabled: !current_text_style.value,
  //   click: () => {
  //     document.execCommand('removeFormat');
  //     document.execCommand('formatBlock', false, '<div>');
  //   },
  // },

  // {
  //   text: current_format_name.value,
  //   title: 'Format',
  //   icon: 'crop_free',
  //   chevron: true,
  //   menu: formats.map(([text, w, h]) => ({
  //     text,
  //     active: page_format_mm.value[0] === w && page_format_mm.value[1] === h,
  //     click: () => {
  //       page_format_mm.value = [w, h];
  //     },
  //   })),
  //   menu_width: 80,
  //   menu_height: 280,
  // },
  // {
  //   text: current_margins_name.value,
  //   title: 'Margins',
  //   icon: 'select_all',
  //   chevron: true,
  //   menu: margins.map(([text, value]) => ({
  //     text: `${text} (${value})`,
  //     active: page_margins.value === value,
  //     click: () => {
  //       page_margins.value = value;
  //     },
  //   })),
  //   menu_width: 200,
  //   menu_class: 'align-center',
  // },
  // {
  //   text: Math.floor(zoom.value * 100) + '%',
  //   title: 'Zoom',
  //   icon: 'zoom_in',
  //   chevron: true,
  //   menu: [
  //     ['200%', 2.0],
  //     ['150%', 1.5],
  //     ['125%', 1.25],
  //     ['100%', 1.0],
  //     ['75%', 0.75],
  //     ['50%', 0.5],
  //     ['25%', 0.25],
  //   ].map(([text, z]) => ({
  //     text,
  //     active: zoom.value === z,
  //     click: () => {
  //       zoom.value = z;
  //     },
  //   })),
  //   menu_width: 80,
  //   menu_height: 280,
  //   menu_class: 'align-center',
  // },
  // {
  //   title: 'Display',
  //   icon: display.value === 'horizontal' ? 'view_column' : display.value === 'vertical' ? 'view_stream' : 'view_module',
  //   chevron: true,
  //   menu: [
  //     {
  //       icon: 'view_module',
  //       active: display.value === 'horizontal',
  //       click: () => {
  //         display.value = 'grid';
  //       },
  //     },
  //     {
  //       icon: 'view_column',
  //       active: display.value === 'horizontal',
  //       click: () => {
  //         display.value = 'horizontal';
  //       },
  //     },
  //     {
  //       icon: 'view_stream',
  //       active: display.value === 'vertical',
  //       click: () => {
  //         display.value = 'vertical';
  //       },
  //     },
  //   ],
  //   menu_width: 55,
  //   menu_class: 'align-right',
  // },
]);

// Undo/Redo flags
const can_undo = computed(() => undo_count.value > 0);
const can_redo = computed(() => content_history.value.length - undo_count.value - 1 > 0);

// Methods
function overlay(page: number, total: number): string {
  let html = `<div style="position: absolute; bottom: 8mm; ${
    page % 2 ? "right" : "left"
  }: 10mm">Page ${page} of ${total}</div>`;
  // if (page >= 2) {
  //   const headerHtml = `<div style="padding: 5mm; background: rgba(200, 220, 240, 0.5);">
  //     <div class="flex align-center justify-between">
  //       <div class="appLogo">Logo</div>
  //       <div class="proposal-info">
  //         <p class="text-sm text-gray-400 font-medium mb-2">
  //           Reference: <span class="text-black">HI - PO - 1882024</span>
  //         </p>
  //         <p class="text-sm text-gray-400 font-medium mb-4">
  //           Version: <span class="text-black">1.0</span>
  //         </p>
  //       </div>
  //     </div>
  //   </div>`;
  //   html += headerHtml;
  //   // html += `<div style="position: absolute; left: 0; top: 0; right: 0; padding: 3mm 5mm; background: rgba(200, 220, 240, 0.5)">
  //   //   <strong>MYCOMPANY</strong> example.com /// This is a custom header overlay</div>`;
  //   // html += `<div style="position: absolute; left: 10mm; right: 10mm; bottom: 5mm; text-align:center; font-size:10pt">
  //   //   MY COMPANY - example.com /// This is a custom footer overlay</div>`;
  // }
  return html;
}

function undo() {
  if (can_undo.value) {
    _mute_next_content_watcher.value = true;
    undo_count.value--;
    content.value = content_history.value[undo_count.value];
  }
}

function redo() {
  if (can_redo.value) {
    _mute_next_content_watcher.value = true;
    undo_count.value++;
    content.value = content_history.value[undo_count.value];
  }
}

function resetContentHistory() {
  content_history.value = [];
  undo_count.value = -1;
}

async function insertPageBreak() {
  document.execCommand("insertParagraph");
  const marker = "###PB###";
  document.execCommand("insertText", false, marker);
  await nextTick();
  await nextTick();
  const regexp = new RegExp("<(p|div|h\\d)( [^/>]+)*>(<[^/>]+>)*" + marker);
  for (let i = 0; i < content.value.length; i++) {
    const item = content.value[i];
    if (typeof item !== "string") continue;
    const match = regexp.exec(item);
    if (match) {
      const tags_open = match[0].slice(0, -marker.length);
      let content_plus_tags_close = item.substr(match.index + match[0].length);
      if (content_plus_tags_close.indexOf("</") === 0) {
        content_plus_tags_close = "<br>" + content_plus_tags_close;
      }
      content.value.splice(
        i,
        1,
        item.substr(0, match.index),
        tags_open + content_plus_tags_close
      );
      return;
    }
  }
  // If not split, remove the marker
  for (let i = 0; i < content.value.length; i++) {
    const item = content.value[i];
    if (typeof item !== "string" || item.indexOf(marker) < 0) continue;
    content.value.splice(i, 1, item.replace(marker, ""));
    break;
  }
}

// Event listeners for zoom and history functionalities
let start_zoom_gesture = 0;
let start_dist_touch = 0;
let start_zoom_touch = 0;

function onWheel(e: WheelEvent) {
  if (e.ctrlKey) {
    e.preventDefault();
    zoom.value = Math.min(
      Math.max(zoom.value - e.deltaY * 0.01, zoom_min.value),
      zoom_max.value
    );
  }
}

function onGestureStart(e: Event) {
  e.preventDefault();
  start_zoom_gesture = zoom.value;
}

function onGestureChange(e: any) {
  e.preventDefault();
  if (!start_zoom_touch) {
    zoom.value = Math.min(
      Math.max(start_zoom_gesture * e.scale, zoom_min.value),
      zoom_max.value
    );
  }
}

function onGestureEnd() {
  start_zoom_gesture = 0;
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    e.preventDefault();
    start_dist_touch = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    start_zoom_touch = zoom.value;
  }
}

function onTouchMove(e: TouchEvent) {
  if (start_dist_touch && start_zoom_touch) {
    e.preventDefault();
    const newDist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    const newZoom = (start_zoom_touch * newDist) / start_dist_touch;
    zoom.value = Math.min(Math.max(newZoom, zoom_min.value), zoom_max.value);
  }
}

function onTouchEnd() {
  start_dist_touch = 0;
  start_zoom_touch = 0;
}

function manageUndoRedo(e: InputEvent) {
  if (e.inputType === "historyUndo") {
    e.preventDefault();
    e.stopPropagation();
    undo();
  } else if (e.inputType === "historyRedo") {
    e.preventDefault();
    e.stopPropagation();
    redo();
  }
}

// Register event listeners on mounted
onMounted(() => {
  mountedState.value = true;
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("gesturestart", onGestureStart);
  window.addEventListener("gesturechange", onGestureChange);
  window.addEventListener("gestureend", onGestureEnd);
  window.addEventListener("touchstart", onTouchStart, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("beforeinput", manageUndoRedo);
  window.addEventListener("input", manageUndoRedo);
});

// Clean up event listeners on unmounted
onUnmounted(() => {
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("gesturestart", onGestureStart);
  window.removeEventListener("gesturechange", onGestureChange);
  window.removeEventListener("gestureend", onGestureEnd);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onTouchEnd);
  window.removeEventListener("beforeinput", manageUndoRedo);
  window.removeEventListener("input", manageUndoRedo);
});

// Watch content changes to manage undo/redo history
watch(
  content,
  (newVal) => {
    if (!_mute_next_content_watcher.value) {
      undo_count.value++;
      content_history.value[undo_count.value] = newVal;
      content_history.value.length = undo_count.value + 1;
    }
    _mute_next_content_watcher.value = false;
  },
  { immediate: true }
);
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
</style>

<style lang="scss" scoped>
.main {
  width: fit-content;
  min-width: 100%;
  position: relative;
}
.bar {
  // position: sticky;
  position: fixed;
  left: 0;
  top: 30;
  // top: 0;
  width: calc(100vw - 16px);
  z-index: 1;
  // z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #e7e6e9 !important;
  backdrop-filter: blur(10px);
  --bar-button-active-color: #5233a1;
  --bar-button-open-color: #5233a1;
  --bar-button-active-bkg: #f8f7fa;
  --bar-button-open-bkg: #f8f7fa;
  :deep(.bar-button .menu) {
    left: auto !important;
    right: auto !important;
    z-index: 1000 !important;
  }
  :deep(.bar-menu-items) {
    width: 400px !important;
    max-width: max-content;
    display: flex !important;
    padding: 5px !important;
    border-radius: 8px !important;
    .bar-menu-item {
      padding: 5px !important;
    }
    .icon {
      margin: 0 !important;
    }
  }
}
// :deep(.bar .bar-menu > .bar-menu-items) {
//   width: 500px !important;
// }
</style>
