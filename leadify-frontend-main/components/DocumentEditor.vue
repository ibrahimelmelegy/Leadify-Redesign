<template>
  <!-- Toolbar -->
  <div
    class="bg-white shadow-md rounded-md py-2 px-6 flex flex-wrap gap-2 items-center"
    style="width: 100vw; position: fixed; z-index: 2"
  >
    <button @click="toggleBold" :class="buttonClass(isBold)">
      <strong>B</strong>
    </button>
    <button @click="toggleItalic" :class="buttonClass(isItalic)">
      <em>I</em>
    </button>
    <button @click="toggleUnderline" :class="buttonClass(isUnderline)">
      <u>U</u>
    </button>

    <!-- Add alignment buttons -->
    <div class="flex items-center border-l border-r border-gray-200 mx-2 px-2">
      <button
        @click="setAlignment('left')"
        :class="buttonClass(alignment === 'left')"
        class="p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="15" y2="12"></line>
          <line x1="3" y1="18" x2="18" y2="18"></line>
        </svg>
      </button>
      <button
        @click="setAlignment('center')"
        :class="buttonClass(alignment === 'center')"
        class="p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="6" y1="12" x2="18" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <button
        @click="setAlignment('right')"
        :class="buttonClass(alignment === 'right')"
        class="p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="9" y1="12" x2="21" y2="12"></line>
          <line x1="6" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <button
        @click="setAlignment('justify')"
        :class="buttonClass(alignment === 'justify')"
        class="p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>

    <select
      v-model="fontSize"
      @change="applyFontSize"
      class="border rounded px-2 py-1 bg-white text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    >
      <option
        v-for="size in fontSizes"
        :key="size"
        :value="size"
        class="text-purple-700"
      >
        {{ size }}px
      </option>
    </select>
    <input
      type="color"
      v-model="fontColor"
      @input="applyFontColor"
      class="w-10 h-8 rounded cursor-pointer border border-gray-200 hover:border-[#5233a1] transition-colors duration-200"
    />

    <button
      @click="triggerImageUpload"
      class="relative group px-3 py-1 border rounded bg-white text-black hover:bg-gray-100"
    >
      <img src="/images/image.jpg" alt="Add Image" class="w-5 h-5" />

      <!-- Tooltip -->
      <span
        class="absolute h-full bottom-full mt-2 top-[100%] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-primary-purple-500 text-white text-sm rounded px-2 py-1"
      >
        Upload Image
      </span>
    </button>

    <input
      type="file"
      ref="imageInput"
      accept="image/*"
      class="hidden"
      @change="handleImageUpload"
    />

    <button
      @click="
        () => {
          sections.type = 'title';
          applySectionType();
        }
      "
      :class="buttonClass(sections.type == 'title')"
      class="relative group"
    >
      <img src="/images/pdf-icons/title.svg" alt="Add Title" class="w-5 h-5" />

      <!-- Tooltip -->
      <span
        class="absolute h-full bottom-full mt-2 top-[100%] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-primary-purple-500 text-white text-sm rounded px-2 py-1"
      >
        Title
      </span>
    </button>

    <button
      @click="
        () => {
          sections.type = 'subtitle';
          applySectionType();
        }
      "
      :class="buttonClass(sections.type == 'subtitle')"
      class="relative group"
    >
      <img
        src="/images/pdf-icons/subtitle.svg"
        alt="Add Subtitle"
        class="w-5 h-5"
      />

      <!-- Tooltip -->
      <span
        class="absolute h-full bottom-full mt-2 top-[100%] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-primary-purple-500 text-white text-sm rounded px-2 py-1"
      >
        Subtitle
      </span>
    </button>

    <button
      @click="
        () => {
          sections.type = 'description';
          applySectionType();
        }
      "
      :class="buttonClass(sections.type == 'description')"
      class="relative group"
    >
      <img
        src="/images/pdf-icons/description.svg"
        alt="Add Description"
        class="w-5 h-5"
      />

      <!-- Tooltip -->
      <span
        class="h-full absolute bottom-full mt-2 top-[100%] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-primary-purple-500 text-white text-sm rounded px-2 py-1"
      >
        Description
      </span>
    </button>

    <button
      @click="
        () => {
          sections.type = 'table';
          applySectionType();
        }
      "
      :class="buttonClass(sections.type == 'table')"
      class="relative group"
    >
      <img src="/images/pdf-icons/table.svg" alt="Add Table" class="w-5 h-5" />
      <!-- Tooltip -->
      <span
        class="h-full absolute bottom-full mt-2 top-[100%] left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-primary-purple-500 text-white text-sm rounded px-2 py-1"
      >
        Table
      </span>
    </button>

    <!-- <select
      v-model="sections.type"
      @change="applySectionType"
      class="ml-auto px-4 py-1.5 bg-white text-purple-700 border border-gray-300 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
    >
      <option value="title" class="text-purple-700">Title</option>
      <option value="subtitle" class="text-purple-700">Subtitle</option>
      <option value="description" class="text-purple-700">Description</option>
      <option value="table" class="text-purple-700">Table</option>
      <option value="image" class="text-purple-700">Image</option>
    </select> -->
  </div>

  <div class="editor" ref="editor" @paste="handlePaste">
    <!-- Page overlays (headers, footers, page numbers, ...) -->
    <div v-if="overlay" class="overlays" ref="overlays">
      <div
        v-for="(page, page_idx) in pages"
        class="overlay"
        :key="page.uuid + '-overlay'"
        :ref="(elt) => (pages_overlay_refs[page.uuid] = elt)"
        v-html="overlay(page_idx + 1, pages.length)"
        :style="page_style(page_idx, false)"
      ></div>
    </div>

    <div
      class="content"
      ref="content"
      :contenteditable="editable"
      :style="page_style(-1)"
      @input="input"
      @keyup="process_current_text_style"
    >
      <!-- This is a Vue "hoisted" static <div> which contains every page of the document and can be modified by the DOM -->
    </div>

    <!-- Items related to the document editor (widgets, ...) can be inserted here -->
  </div>
</template>

<script>
import { defineCustomElement, defineAsyncComponent } from "vue";
import {
  move_children_forward_recursively,
  move_children_backwards_with_merging,
} from "~/utils/page-transition-mgmt.js";

import { defaultDataProposal } from "./defaultDtat";
export default {
  props: {
    // This contains the initial content of the document that can be synced
    // It must be an Array: each array item is a new set of pages containing the
    // item (string or component). You can see that as predefined page breaks.
    content: {
      type: Array,
      required: true,
    },
    financeTable: {
      type: Object,
      required: false,
    },
    // Invoice data for the first page
    invoiceData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    // Display mode of the pages
    display: {
      type: String,
      default: "grid", // ["grid", "horizontal", "vertical"]
    },

    // Sets whether document text can be modified
    editable: {
      type: Boolean,
      default: true,
    },

    // Overlay function returning page headers and footers in HTML
    overlay: Function,

    // Pages format in mm (should be an array containing [width, height])
    page_format_mm: {
      type: Array,
      default: () => [210, 297],
    },

    // Page margins in CSS
    page_margins: {
      type: [String, Function],
      default: "10mm 15mm",
    },

    // Display zoom. Only acts on the screen display
    zoom: {
      type: Number,
      default: 1.0,
    },

    // "Do not break" test function: should return true on elements you don't want to be split over multiple pages but rather be moved to the next page
    do_not_break: Function,
  },

  data() {
    return {
      pages: [], // contains {uuid, content_idx, prev_html, template, props, elt} for each pages of the document
      pages_overlay_refs: {}, // contains page overlay ref elements indexed by uuid
      pages_height: 0, // real measured page height in px (corresponding to page_format_mm[1])
      editor_width: 0, // real measured with of an empty editor <div> in px
      prevent_next_content_update_from_parent: false, // workaround to avoid infinite update loop
      current_text_style: false, // contains the style at caret position
      printing_mode: false, // flag set when page is rendering in printing mode
      sections: { type: "description" },
      alignment: ref("left"),
    };
  },

  setup() {
    const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32];
    const fontSize = ref(12);
    const fontColor = ref("#000000");
    const imageInput = ref(null);
    const alignment = ref("left");

    const isBold = ref(false);
    const isItalic = ref(false);
    const isUnderline = ref(false);

    const execCommand = (command, value = null) => {
      document.execCommand(command, false, value);
    };

    const setAlignment = (align) => {
      execCommand(
        "justify" +
          (align === "left"
            ? "Left"
            : align === "center"
            ? "Center"
            : align === "right"
            ? "Right"
            : "Full")
      );
      alignment.value = align;
    };

    const toggleBold = () => {
      execCommand("bold");
      isBold.value = !isBold.value;
    };

    const toggleItalic = () => {
      execCommand("italic");
      isItalic.value = !isItalic.value;
    };

    const toggleUnderline = () => {
      execCommand("underline");
      isUnderline.value = !isUnderline.value;
    };

    const applyFontSize = () => {
      execCommand("fontSize", 7);
      const fontElements = document.getElementsByTagName("font");
      for (let i = 0; i < fontElements.length; i++) {
        if (fontElements[i].size === "7") {
          fontElements[i].removeAttribute("size");
          fontElements[i].style.fontSize = fontSize.value + "px";
        }
      }
    };

    const applyFontColor = () => {
      execCommand("foreColor", fontColor.value);
    };

    const triggerImageUpload = () => {
      imageInput.value.click();
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.maxWidth = "70%";
          img.style.height = "auto";
          img.style.margin = "10px 0";

          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Create a container for the image
            const imageContainer = document.createElement("div");
            imageContainer.style.margin = "20px 0";
            imageContainer.style.display = "flex";
            imageContainer.style.justifyContent = "center";
            imageContainer.appendChild(img);

            range.deleteContents(); // Remove existing selection content
            range.insertNode(imageContainer); // Insert the image at the cursor position

            // Move the cursor after the image
            range.setStartAfter(imageContainer);
            range.setEndAfter(imageContainer);
            selection.removeAllRanges();
            selection.addRange(range);
          }

          // Trigger content update
          this.fit_content_over_pages();
          this.emit_new_content();
        };
        reader.readAsDataURL(file);
      }
      event.target.value = "";
    };

    const buttonClass = (active) =>
      `px-3 py-1 border rounded ${
        active
          ? "bg-[#ccbcf8] text-white"
          : "bg-white text-black hover:bg-gray-100"
      }`;
    return {
      fontSizes,
      fontSize,
      fontColor,
      isBold,
      isItalic,
      isUnderline,
      imageInput,
      alignment,
      toggleBold,
      toggleItalic,
      toggleUnderline,
      applyFontSize,
      applyFontColor,
      buttonClass,
      triggerImageUpload,
      handleImageUpload,
      setAlignment,
    };
  },
  mounted() {
    this.update_editor_width();
    this.update_css_media_style();
    this.reset_content();
    window.addEventListener("resize", this.update_editor_width);
    window.addEventListener("click", this.process_current_text_style);
    window.addEventListener("beforeprint", this.before_print);
    window.addEventListener("afterprint", this.after_print);
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        this.undo();
      }
    });
  },

  beforeUpdate() {
    this.pages_overlay_refs = [];
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.update_editor_width);
    window.removeEventListener("click", this.process_current_text_style);
    window.removeEventListener("beforeprint", this.before_print);
    window.removeEventListener("afterprint", this.after_print);
  },

  computed: {
    css_media_style() {
      // creates a CSS <style> and returns it
      const style = document.createElement("style");
      document.head.appendChild(style);
      return style;
    },
  },

  methods: {
    handlePaste(event) {
      event.preventDefault();

      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData("text");

      // Check if the pasted content is likely a table
      const isTable =
        pastedText.includes("\t") || /<table[^>]*>/.test(pastedText);

      if (isTable) {
        // Convert tab-separated values into an HTML table
        const rows = pastedText
          .split(/\r?\n/)
          .filter((row) => row.trim() !== "");

        let tableHTML =
          "<table style='width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 16px; text-align: left;'><tbody>";

        rows.forEach((row) => {
          const cells = row.split(/\t/);
          tableHTML += "<tr style='padding: 12px; border: 1px solid #ddd;'>";

          if (cells.filter((el) => el !== "").length === 1) {
            // Single column case - make sure it aligns correctly

            tableHTML += `<td colspan="${cells.length}" style='padding: 12px; border: 1px solid #ddd;'>${cells[0]}</td>`;
          } else {
            // Multi-column case: Keep static column structure and handle null values
            cells.forEach((cell, index) => {
              let colspan = 1;
              let data;

              if (cells?.[index + 1]?.trim() == "") {
                colspan = colspan + 1;
                if (cells?.[index] && cells?.[index]?.trim() !== "")
                  data = cells?.[index];
              }
              if (colspan > 1 && data)
                tableHTML += `<td colspan="${colspan}" style='padding: 12px; border: 1px solid #ddd;'>${data}</td>`;
              else if (cells?.[index] && cells?.[index]?.trim() !== "")
                tableHTML += `<td style='padding: 12px; border: 1px solid #ddd;'>${cell}</td>`;
            });
          }

          tableHTML += "</tr>";
        });

        tableHTML += "</tbody></table>";

        // Insert the table into the editor
        document.execCommand("insertHTML", false, tableHTML);
      } else {
        document.execCommand("insertHTML", false, pastedText);
      }
    },
    undo() {
      console.log("undo");
      document.execCommand("undo");
    },
    execCommand: (command, value = null) => {
      document.execCommand(command, false, value);
    },
    // Computes a random 5-char UUID
    new_uuid: () => Math.random().toString(36).slice(-5),

    // Resets all content from the content property
    reset_content() {
      // Prevent launching this function multiple times
      if (this.reset_in_progress) return;
      this.reset_in_progress = true;

      // Initialize pages array
      this.pages = [];

      // Add invoice template as first page
      this.pages.push({
        uuid: this.new_uuid(),
        content_idx: 0,
        isInvoice: true,
        template: "InvoiceTemplate",
        props: this.invoiceData,
      });

      if (
        this?.invoiceData?.proposalDetails?.content == "" ||
        this?.invoiceData?.proposalDetails?.content == null
      ) {
        const htmlString = defaultDataProposal;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const allPage = doc.querySelectorAll(".pageData");
        let tableHTML;

        allPage?.forEach((el, index) => {
          el.querySelectorAll("#titleEdit").forEach((el1) => {
            if (el1.innerHTML.trim() === "2.Finance Table :") {
              // First, collect all unique custom column keys from all items
              const customColumnKeys = new Set();
              this?.financeTable?.financeTable?.items?.forEach((item) => {
                item?.customColumns?.forEach((col) => {
                  if (col?.key) {
                    customColumnKeys.add({ key: col.key, index: col.index });
                  }
                });
              });

              const tableStatic = {
                columns: [
                  {
                    prop: "index",
                    label: "#",
                    component: "Text",
                    type: "font-default",
                    width: 60,
                    value: 0,
                  },
                  {
                    prop: "description",
                    label: "Description",
                    component: "Text",
                    type: "font-default",
                    width: 220,
                    value: 1,
                  },
                  {
                    prop: "quantity",
                    label: "Quantity",
                    component: "Text",
                    type: "font-default",
                    width: 120,
                    value: 2,
                  },
                  {
                    prop: "unitPrice",
                    label: "Unit price",
                    component: "Text",
                    type: "font-default",
                    width: 120,
                    value: 3,
                  },
                  {
                    prop: "totalPrice",
                    label: "Total Price",
                    component: "Text",
                    type: "font-default",
                    width: 120,
                    value: 4,
                  },
                ],
                data:
                  this?.financeTable?.financeTable?.items?.map((el, index) => {
                    // Create base object with standard fields
                    const baseObj = {
                      index: index + 1,
                      id: el?.id,
                      description: el?.description,
                      quantity: el?.qty,
                     totalPrice:el?.qty * ((el?.unitPrice - el?.marginAmount ) +
                        ((el?.unitPrice - el?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)),
                      unitPrice:
                        (el?.unitPrice -
                        el?.marginAmount) +
                        ((el?.unitPrice - el?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100) ,
                      discount: this?.invoiceData?.proposalDetails?.financeTable?.discount,
                      margin: this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage,
                    };

                    // Add custom columns
                    const customCols = {};
                    el?.customColumns?.forEach((col) => {
                      if (col?.key) {
                        customCols[col.key] = col.value;
                      }
                    });

                    // Add empty values for any custom columns that don't exist in this row
                    customColumnKeys.forEach((key) => {
                      if (!customCols.hasOwnProperty(key)) {
                        customCols[key] = "";
                      }
                    });

                    return {
                      ...baseObj,
                      ...customCols,
                    };
                  }) || [],
              };

              // Add custom columns to the columns array
              customColumnKeys.forEach((el) => {
                tableStatic.columns.push({
                  prop: el.key,
                  label: el.key,
                  component: "Text",
                  type: "font-default",
                  width: 120,
                  value: el.index,
                });
              });
              tableStatic.columns = tableStatic.columns?.sort(
                (a, b) => a.value - b.value
              );
              tableHTML = `
<div style="display: flex; justify-content: center; margin: 20px;">
    <table style="
      width: 100%;
      max-width: 1000px;
      border-collapse: collapse;
      border: 1px solid #dcdfe6;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      text-align: left;
    ">
      <thead>
        <tr style="background-color: #f8f7fa; color: #5f5a6a;">`;
              tableStatic.columns.forEach((col) => {
                tableHTML += `<th style="padding: 12px; border: 1px solid #ebeef5;">${col.label}</th>`;
              });
              tableHTML += `
        </tr>
      </thead>
      <tbody>`;
              tableStatic?.data?.forEach((row) => {
                tableHTML += `<tr style="cursor: pointer; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#f5f7fa'" onmouseout="this.style.backgroundColor='transparent'">`;
                tableStatic.columns.forEach((col) => {
                  const value = row[col.prop];
                  const isNumeric = [
                    "quantity",
                    "unitPrice",
                    "totalPrice",
                  ].includes(col.prop);
                  tableHTML += `<td style="padding: 12px; border: 1px solid #ebeef5; ${
                    isNumeric ? "text-align: right; font-weight: 600;" : ""
                  }">${
                    isNumeric
                      ? value
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(value))
                        : "0.00"
                      : value || ""
                  }</td>`;
                });
                tableHTML += `</tr>`;
              });
              tableHTML += `
          </tr>
      </tbody>
    </table>
  </div>`;
               // Add summary section
             const totalPrice =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0))
               ;
              const vat =
             
                  (this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0) - (this?.invoiceData?.proposalDetails?.financeTable?.discount || 0))* 0.15 || 0 
              const discount =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable?.discount
                ) || 0;
              const marginPercentage =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.marginPercentage
                ) || 0;
              const projectMargin = (totalPrice * marginPercentage) / 100;
              const finalTotal =
                   Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0)) - Number(
                  this?.invoiceData?.proposalDetails?.financeTable?.discount
                ) || 0;
              tableHTML += `
  <div class="flex justify-end mt-8" style="max-width: 1000px; margin: 20px auto;">
    <div style="width: 400px;">
      <p style="font-size: 18px; font-weight: 600; color: #171717; margin-bottom: 12px;">Summary</p>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">GrandTotal :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(totalPrice)} SAR</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">Vat (15%) :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(vat)} SAR</p>
      </div>
      ${
        discount > 0
          ? `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">Discount :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(discount)} SAR</p>
      </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #171717; font-weight: 600;">Total Price :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(finalTotal)} SAR</p>
      </div>
    </div>
  </div>`;
            }
          });

          if (index > 0)
            this.pages.push({
              uuid: this.new_uuid(),
              content_idx: index + 1,
              isInvoice: false,
              content: `
              <div class="page" contenteditable="true">
                <div class="flex align-center justify-between">
          <div class="appLogo"><img class="w-[120px]" src="/images/Logo.png" alt="Logo" /></div>
          <div class="proposal-info">
            <p class="text-sm text-gray-400 font-medium mb-2">
              Reference: <span class="text-black">${this?.invoiceData?.proposalDetails?.reference}</span>
            </p>
            <p class="text-sm text-gray-400 font-medium mb-4">
              Version: <span class="text-black">${this?.invoiceData?.proposalDetails?.version}</span>
            </p>
          </div>
        </div>
        ${el.innerHTML} ${tableHTML}
      </div>
      </div>
      <br>`,
            });
          tableHTML = "";
        });
        //   this.pages.push({
        //     uuid: this.new_uuid(),
        //     content_idx: 1,
        //     isInvoice: false,
        //     content: `<div contenteditable="false">
        //   <div class="flex align-center justify-between">
        //     <div class="appLogo"><img class="w-[120px]" src="/images/Logo.png" alt="Logo" /></div>
        //     <div class="proposal-info">
        //       <p class="text-sm text-gray-400 font-medium mb-2">
        //         Reference: <span class="text-black">${this?.invoiceData?.proposalDetails?.reference}</span>
        //       </p>
        //       <p class="text-sm text-gray-400 font-medium mb-4">
        //         Version: <span class="text-black">${this?.invoiceData?.proposalDetails?.version}</span>
        //       </p>
        //     </div>
        //   </div>
        // </div>
        // <br />
        // `,
        // });
      } else {
        const htmlString = this?.invoiceData?.proposalDetails?.content;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const allPage = doc.querySelectorAll(".page");
        let tableHTML = "";
        allPage?.forEach((el, index) => {
          el.querySelectorAll("#titleEdit").forEach((el1) => {
            if (el1.innerHTML.trim() === "2.Finance Table :") {
              // First, collect all unique custom column keys from all items
              const customColumnKeys = new Set();
              this?.financeTable?.financeTable?.items?.forEach((item) => {
                item?.customColumns?.forEach((col) => {
                  if (col?.key) {
                    customColumnKeys.add({ key: col.key, index: col.index });
                  }
                });
              });

              const tableStatic = {
                columns: [
                  {
                    prop: "index",
                    label: "#",
                    component: "Text",
                    type: "font-default",
                    width: 60,
                    value: 0,
                  },
                  {
                    prop: "description",
                    label: "Description",
                    component: "Text",
                    type: "font-default",
                    width: 220,
                    value: 1,
                  },
                  {
                    prop: "quantity",
                    label: "Quantity",
                    component: "Text",
                    type: "font-default",
                    width: 120,
                    value: 2,
                  },
                  {
                    prop: "unitPrice",
                    label: "Unit price",
                    component: "Text",
                    type: "font-default",
                    width: 120,
                    value: 3,
                  },
                  {
                    prop: "totalPrice",
                    label: "Total Price",
                    component: "Text",
                    type: "font-default",
                    width: 120,
                    value: 4,
                  },
                ],
                data:
                  this?.financeTable?.financeTable?.items?.map((el, index) => {
                    // Create base object with standard fields
                    const baseObj = {
                      index: index + 1,
                      id: el?.id,
                      description: el?.description,
                      quantity: el?.qty,
                     totalPrice:el?.qty * ((el?.unitPrice - el?.marginAmount ) +
                        ((el?.unitPrice - el?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)),
                      unitPrice:
                        (el?.unitPrice -
                        el?.marginAmount) +
                        ((el?.unitPrice - el?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100) ,
                      discount: this?.invoiceData?.proposalDetails?.financeTable?.discount,
                      margin: this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage,
                    };

                    // Add custom columns
                    const customCols = {};
                    el?.customColumns?.forEach((col) => {
                      if (col?.key) {
                        customCols[col.key] = col.value;
                      }
                    });

                    // Add empty values for any custom columns that don't exist in this row
                    customColumnKeys.forEach((key) => {
                      if (!customCols.hasOwnProperty(key)) {
                        customCols[key] = "";
                      }
                    });

                    return {
                      ...baseObj,
                      ...customCols,
                    };
                  }) || [],
              };

              // Add custom columns to the columns array
              customColumnKeys.forEach((el) => {
                tableStatic.columns.push({
                  prop: el.key,
                  label: el.key,
                  component: "Text",
                  type: "font-default",
                  width: 120,
                  value: el.index,
                });
              });
              tableStatic.columns = tableStatic.columns?.sort(
                (a, b) => a.value - b.value
              );
              tableHTML = `
              <div class="pageData" contenteditable="true">
        <div id="titleEdit" style=" font-weight: 600;
  font-size: 24px;
  color: #5233a1;
  font-family: Gilroy;
  margin-bottom: 16px;
  line-height: 1.4;
  border-bottom: 4px solid #5233a1;
  padding-bottom: 8px;
  display: inline-block" dataset-content-idx = "3"> 1. Introduction :   </div>
        <br>
        <div id="descriptionEdit"  style="font-size: 16px;
  color: #333333;
  font-family: Gilroy;
  line-height: 1.6;
  margin-bottom: 12px;"> This document has been carefully crafted to present <span class="text-gray-500"> HIGH POINT</span>  with a comprehensive
financial proposal for the necessary supply and professional services. It provides a
detailed quotation, ensuring a thorough understanding of the financial elements
involved.  </div>
        <br>
        <div id="titleEdit" dataset-content-idx = "3" style=" font-weight: 600;
  font-size: 24px;
  color: #5233a1;
  font-family: Gilroy;
  margin-bottom: 16px;
  line-height: 1.4;
  border-bottom: 4px solid #5233a1;
  padding-bottom: 8px;
  display: inline-block"> 2.Finance Table :</div>
      </div>
      </div>
      <br>
<div style="display: flex; justify-content: center; margin: 20px;">
    <table style="
      width: 100%;
      max-width: 1000px;
      border-collapse: collapse;
      border: 1px solid #dcdfe6;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      text-align: left;
    ">
      <thead>
        <tr style="background-color: #f8f7fa; color: #5f5a6a;">`;
              tableStatic.columns.forEach((col) => {
                tableHTML += `<th style="padding: 12px; border: 1px solid #ebeef5;">${col.label}</th>`;
              });
              tableHTML += `
        </tr>
      </thead>
      <tbody>`;
              tableStatic?.data?.forEach((row) => {
                tableHTML += `<tr style="cursor: pointer; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#f5f7fa'" onmouseout="this.style.backgroundColor='transparent'">`;
                tableStatic.columns.forEach((col) => {
                  const value = row[col.prop];
                  const isNumeric = [
                    "quantity",
                    "unitPrice",
                    "totalPrice",
                  ].includes(col.prop);
                  tableHTML += `<td style="padding: 12px; border: 1px solid #ebeef5; ${
                    isNumeric ? "text-align: right; font-weight: 600;" : ""
                  }">${
                    isNumeric
                      ? value
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(value))
                        : "0.00"
                      : value || ""
                  }</td>`;
                });
                tableHTML += `</tr>`;
              });
              tableHTML += `
          </tr>
      </tbody>
    </table>
  </div>`;
              // Add summary section
              // Add summary section
             const totalPrice =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0))
               ;
              const vat =
             
                  (this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0) - (this?.invoiceData?.proposalDetails?.financeTable?.discount || 0))* 0.15 || 0 
              const discount =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable?.discount
                ) || 0;
              const marginPercentage =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.marginPercentage
                ) || 0;
              const projectMargin = (totalPrice * marginPercentage) / 100;
              const finalTotal =
                   Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0)) - Number(
                  this?.invoiceData?.proposalDetails?.financeTable?.discount
                ) || 0;
              tableHTML += `
  <div class="flex justify-end mt-8" style="max-width: 1000px; margin: 20px auto;">
    <div style="width: 400px;">
      <p style="font-size: 18px; font-weight: 600; color: #171717; margin-bottom: 12px;">Summary</p>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">GrandTotal :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(totalPrice)} SAR</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">Vat (15%) :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(vat)} SAR</p>
      </div>
      ${
        discount > 0
          ? `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">Discount :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(discount)} SAR</p>
      </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #171717; font-weight: 600;">Total Price :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(finalTotal)} SAR</p>
      </div>
    </div>
  </div>`;
            }
          });
          if (index > 0 && el.getAttribute("data-content-idx")) {
            this.pages.push({
              uuid: this.new_uuid(),
              content_idx: index + 1,
              isInvoice: false,
              content: `${tableHTML == "" ? el.innerHTML : tableHTML}`,
            });
          }
          tableHTML = "";
        });
      }

      this.update_pages_elts();

      // Get page height from first empty page
      const first_page_elt = this.pages[0].elt;
      if (!this.$refs.content.contains(first_page_elt))
        this.$refs.content.appendChild(first_page_elt); // restore page in DOM in case it was removed
      this.pages_height = first_page_elt.clientHeight + 1; // allow one pixel precision

      // Initialize pages
      for (const page of this.pages) {
        if (page.isInvoice) {
          // Initialize invoice template page
          const InvoiceTemplate = defineAsyncComponent(() =>
            import("./InvoiceTemplate.ce.vue")
          );
          const componentElement = defineCustomElement(InvoiceTemplate);
          customElements.define(
            "invoice-template-" + page.uuid,
            componentElement
          );
          page.elt.appendChild(
            new componentElement({ modelValue: page.props })
          );
        } else {
          // Initialize content pages
          page.elt.innerHTML = page.content
            ? "<div>" + page.content + "</div>"
            : "<div><br></div>";
        }

        // restore page in DOM in case it was removed
        if (!this.$refs.content.contains(page.elt))
          this.$refs.content.appendChild(page.elt);
      }

      // Spread content over several pages if it overflows
      this.fit_content_over_pages();

      // Remove the text cursor from the content, if any (its position is lost anyway)
      this.$refs.content.blur();

      // Clear "reset in progress" flag
      this.reset_in_progress = false;
    },

    // Spreads the HTML content over several pages until it fits
    fit_content_over_pages() {
      // Data variable this.pages_height must have been set before calling this function
      if (!this.pages_height) return;

      // Prevent launching this function multiple times
      if (this.fit_in_progress) return;
      this.fit_in_progress = true;

      // Check pages that were deleted from the DOM (start from the end)
      for (let page_idx = this.pages.length - 1; page_idx >= 0; page_idx--) {
        const page = this.pages[page_idx];

        // if user deleted the page from the DOM, then remove it from this.pages array
        if (!page.elt || !document.body.contains(page.elt))
          this.pages.splice(page_idx, 1);
      }

      // If all the document was wiped out, start a new empty document
      if (!this.pages.length) {
        this.fit_in_progress = false; // clear "fit in progress" flag
        this.$emit("update:content", [""]);
        return;
      }

      // Save current selection (or cursor position) by inserting empty HTML elements at the start and the end of it
      const selection = window.getSelection();
      const start_marker = document.createElement("null");
      const end_marker = document.createElement("null");
      // don't insert markers in case selection fails (if we are editing in components in the shadow-root it selects the page <div> as anchorNode)
      if (
        selection &&
        selection.rangeCount &&
        selection.anchorNode &&
        !(
          selection.anchorNode.dataset &&
          selection.anchorNode.dataset.isVDEPage != null
        )
      ) {
        const range = selection.getRangeAt(0);
        range.insertNode(start_marker);
        range.collapse(false);
        range.insertNode(end_marker);
      }

      // Browse every remaining page
      let prev_page_modified_flag = false;
      for (let page_idx = 0; page_idx < this.pages.length; page_idx++) {
        // page length can grow inside this loop
        const page = this.pages[page_idx];
        let next_page = this.pages[page_idx + 1];
        let next_page_elt = next_page ? next_page.elt : null;

        // check if this page, the next page, or any previous page content has been modified by the user (don't apply to template pages)
        if (
          !page.template &&
          (prev_page_modified_flag ||
            page.elt.innerHTML != page.prev_innerHTML ||
            (next_page_elt &&
              !next_page.template &&
              next_page_elt.innerHTML != next_page.prev_innerHTML))
        ) {
          prev_page_modified_flag = true;

          // BACKWARD-PROPAGATION
          // check if content doesn't overflow, and that next page exists and has the same content_idx
          if (
            page.elt.clientHeight <= this.pages_height &&
            next_page &&
            next_page.content_idx == page.content_idx
          ) {
            // try to append every node from the next page until it doesn't fit
            move_children_backwards_with_merging(
              page.elt,
              next_page_elt,
              () =>
                !next_page_elt.childNodes.length ||
                page.elt.clientHeight > this.pages_height
            );
          }

          // FORWARD-PROPAGATION
          // check if content overflows
          if (page.elt.clientHeight > this.pages_height) {
            // if there is no next page for the same content, create it
            if (!next_page || next_page.content_idx != page.content_idx) {
              next_page = {
                uuid: this.new_uuid(),
                content_idx: page.content_idx,
              };
              this.pages.splice(page_idx + 1, 0, next_page);
              this.update_pages_elts();
              next_page_elt = next_page.elt;
            }

            // move the content step by step to the next page, until it fits
            move_children_forward_recursively(
              page.elt,
              next_page_elt,
              () => page.elt.clientHeight <= this.pages_height,
              this.do_not_break
            );
          }

          // CLEANING
          // remove next page if it is empty
          if (
            next_page_elt &&
            next_page.content_idx == page.content_idx &&
            !next_page_elt.childNodes.length
          ) {
            this.pages.splice(page_idx + 1, 1);
          }
        }

        // update pages in the DOM
        this.update_pages_elts();
      }

      // Normalize pages HTML content
      for (const page of this.pages) {
        if (!page.template) page.elt.normalize(); // normalize HTML (merge text nodes) - don't touch template pages or it can break Vue
      }

      // Restore selection and remove empty elements
      if (document.body.contains(start_marker)) {
        const range = document.createRange();
        range.setStart(start_marker, 0);
        if (document.body.contains(end_marker)) range.setEnd(end_marker, 0);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      if (start_marker.parentElement)
        start_marker.parentElement.removeChild(start_marker);
      if (end_marker.parentElement)
        end_marker.parentElement.removeChild(end_marker);

      // Store pages HTML content
      for (const page of this.pages) {
        page.prev_innerHTML = page.elt.innerHTML; // store current pages innerHTML for next call
      }

      // Clear "fit in progress" flag
      this.fit_in_progress = false;
    },

    // Input event
    input(e) {
      if (!e) return; // check that event is set
      this.fit_content_over_pages(); // fit content according to modifications
      this.emit_new_content(); // emit content modification
      if (e.inputType != "insertText") this.process_current_text_style(); // update current style if it has changed
    },

    applySectionType() {
      const pages = document.querySelectorAll(".page");
      if (pages.length > 0) {
        const lastPage = pages[pages.length - 1];

        // Create a new div with the appropriate styling based on section type
        let newDiv = document.createElement("div");
        newDiv.id = `${this.sections.type}Edit`;

        // Apply specific styles based on section type
        if (this.sections.type === "title") {
          newDiv.dataset.contentIdx = `${pages.length - 2}`;
          newDiv.style.cssText = `
  font-weight: 600;
  font-size: 24px;
  color: #5233a1;
  font-family: Gilroy;
  margin-bottom: 16px;
  line-height: 1.4;
  border-bottom: 4px solid #5233a1; /* This adds a line under the title */
  padding-bottom: 8px;
  display: inline-block; /* Makes the border match the text width */
`;
        } else if (this.sections.type === "subtitle") {
          newDiv.dataset.contentIdx = `${pages.length - 2}`;
          newDiv.style.cssText = `
            font-weight: 600;
            font-size: 18px;
            color: #10003a;
            font-family: Gilroy;
            margin-bottom: 12px;
            line-height: 1.4;
          `;
        } else if (this.sections.type === "description") {
          newDiv.style.cssText = `
            font-size: 16px;
            color: #333333;
            font-family: Gilroy;
            line-height: 1.6;
            margin-bottom: 12px;
          `;
        } else if (this.sections.type === "image") {
          // Trigger image upload when image option is selected
          this.triggerImageUpload();
          return; // Return early as we don't need to create a div for image
        }

        newDiv.innerHTML = "<br>";

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);

          // Create a container for the image
          const imageContainer = document.createElement("div");

          imageContainer.appendChild(newDiv);

          range.deleteContents(); // Remove existing selection content
          range.insertNode(imageContainer); // Insert the image at the cursor position

          // Move the cursor after the image
          range.setStartAfter(imageContainer);
          range.setEndAfter(imageContainer);
          selection.removeAllRanges();
          selection.addRange(range);
          imageContainer.focus();
          // Move cursor to the end
          range.selectNodeContents(newDiv);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        if (this.sections.type == "table") {
          // First, collect all unique custom column keys from all items
          const customColumnKeys = new Set();
          this?.financeTable?.financeTable?.items?.forEach((item) => {
            item?.customColumns?.forEach((col) => {
              if (col?.key) {
                customColumnKeys.add({ key: col.key, index: col.index });
              }
            });
          });

          const tableStatic = {
            columns: [
              {
                prop: "index",
                label: "#",
                component: "Text",
                type: "font-default",
                width: 60,
                value: 0,
              },
              {
                prop: "description",
                label: "Description",
                component: "Text",
                type: "font-default",
                width: 220,
                value: 1,
              },
              {
                prop: "quantity",
                label: "Quantity",
                component: "Text",
                type: "font-default",
                width: 120,
                value: 2,
              },
              {
                prop: "unitPrice",
                label: "Unit price",
                component: "Text",
                type: "font-default",
                width: 120,
                value: 3,
              },
              {
                prop: "totalPrice",
                label: "Total Price",
                component: "Text",
                type: "font-default",
                width: 120,
                value: 4,
              },
            ],
            data:
              this?.financeTable?.financeTable?.items?.map((el, index) => {
                // Create base object with standard fields
                const baseObj = {
                  index: index + 1,
                  id: el?.id,
                  description: el?.description,
                  quantity: el?.qty,
                totalPrice:el?.qty * ((el?.unitPrice - el?.marginAmount ) +
                        ((el?.unitPrice - el?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)),
                  unitPrice: (el?.unitPrice - el?.marginAmount) + ((el?.unitPrice - el?.marginAmount) * this?.financeTable?.marginPercentage/ 100) ,
                  discount: this?.invoiceData?.proposalDetails?.financeTable?.discount,
                  margin: this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage,
                };

                // Add custom columns
                const customCols = {};
                el?.customColumns?.forEach((col) => {
                  if (col?.key) {
                    customCols[col.key] = col.value;
                  }
                });

                // Add empty values for any custom columns that don't exist in this row
                customColumnKeys.forEach((key) => {
                  if (!customCols.hasOwnProperty(key)) {
                    customCols[key] = "";
                  }
                });

                return {
                  ...baseObj,
                  ...customCols,
                };
              }) || [],
          };

          // Add custom columns to the columns array
          customColumnKeys.forEach((el) => {
            tableStatic.columns.push({
              prop: el.key,
              label: el.key,
              component: "Text",
              type: "font-default",
              width: 120,
              value: el.index,
            });
          });
          tableStatic.columns = tableStatic.columns?.sort(
            (a, b) => a.value - b.value
          );
          let tableHTML = `
<div style="display: flex; justify-content: center; margin: 20px;">
    <table style="
      width: 100%;
      max-width: 1000px;
      border-collapse: collapse;
      border: 1px solid #dcdfe6;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      text-align: left;
    ">
      <thead>
        <tr style="background-color: #f8f7fa; color: #5f5a6a;">`;
          tableStatic.columns.forEach((col) => {
            tableHTML += `<th style="padding: 12px; border: 1px solid #ebeef5;">${col.label}</th>`;
          });
          tableHTML += `
        </tr>
      </thead>
      <tbody>`;
          tableStatic?.data?.forEach((row) => {
            tableHTML += `<tr style="cursor: pointer; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#f5f7fa'" onmouseout="this.style.backgroundColor='transparent'">`;
            tableStatic.columns.forEach((col) => {
              const value = row[col.prop];
              const isNumeric = [
                "quantity",
                "unitPrice",
                "totalPrice",
              ].includes(col.prop);
              tableHTML += `<td style="padding: 12px; border: 1px solid #ebeef5; ${
                isNumeric ? "text-align: right; font-weight: 600;" : ""
              }">${
                isNumeric
                  ? value
                    ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(value))
                    : "0.00"
                  : value || ""
              }</td>`;
            });
            tableHTML += `</tr>`;
          });
          tableHTML += `
          </tr>
      </tbody>
    </table>
  </div>`;

           // Add summary section
             const totalPrice =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0))
               ;
              const vat =
             
                  (this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0) - (this?.invoiceData?.proposalDetails?.financeTable?.discount || 0))* 0.15 || 0 
              const discount =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable?.discount
                ) || 0;
              const marginPercentage =
                Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.marginPercentage
                ) || 0;
              const projectMargin = (totalPrice * marginPercentage) / 100;
              const finalTotal =
                   Number(
                  this?.invoiceData?.proposalDetails?.financeTable
                    ?.items.reduce((sum, item) => {return sum + (item?.qty * ((item?.unitPrice - item?.marginAmount ) +
                        ((item?.unitPrice - item?.marginAmount) *
                          this?.invoiceData?.proposalDetails?.financeTable?.marginPercentage/
                          100)));}, 0)) - Number(
                  this?.invoiceData?.proposalDetails?.financeTable?.discount
                ) || 0;
          tableHTML += `
  <div class="flex justify-end mt-8" style="max-width: 1000px; margin: 20px auto;">
    <div style="width: 400px;">
      <p style="font-size: 18px; font-weight: 600; color: #171717; margin-bottom: 12px;">Summary</p>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">GrandTotal :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(totalPrice)} SAR</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">Vat (15%) :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(vat)} SAR</p>
      </div>
      ${
        discount > 0
          ? `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #737373;">Discount :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(discount)} SAR</p>
      </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 48px; margin-bottom: 16px;">
        <p style="font-size: 16px; color: #171717; font-weight: 600;">Total Price :</p>
        <p style="font-size: 16px; color: #171717; font-weight: 600;">${new Intl.NumberFormat(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ).format(finalTotal)} SAR</p>
      </div>
    </div>
  </div>`;

          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Create a temporary container for the table
            const tableContainer = document.createElement("div");
            tableContainer.innerHTML = tableHTML; // Function to generate table HTML

            // Insert the table at the cursor position
            range.deleteContents();
            range.insertNode(tableContainer);

            // Move cursor after the table
            range.setStartAfter(tableContainer);
            range.setEndAfter(tableContainer);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    },
    // Emit content change to parent
    emit_new_content() {
      const new_content = [];
      let invoiceData = null;

      // Process each page
      this.pages.forEach((page) => {
        if (page.isInvoice) {
          // For invoice page, get the data from the component
          invoiceData = page.props;
        } else {
          // For content pages, get the HTML content
          let elt = page.elt;
          while (
            elt.children.length == 1 &&
            elt.firstChild.tagName &&
            elt.firstChild.tagName.toLowerCase() == "div" &&
            !elt.firstChild.getAttribute("style")
          ) {
            elt = elt.firstChild;
          }
          const content =
            elt.innerHTML == "<br>" || elt.innerHTML == "<!---->"
              ? ""
              : elt.innerHTML;
          new_content.push(content);
        }
      });

      // Avoid calling reset_content after the parent content is updated
      this.prevent_next_content_update_from_parent = true;

      // Emit the content update
      this.$emit("update:content", new_content);

      // Emit the complete document data
      this.$emit("update:document", {
        invoice: invoiceData,
        content: new_content,
      });
    },

    // Sets current_text_style with CSS style at caret position
    process_current_text_style() {
      let style = false;
      const sel = window.getSelection();
      if (sel.focusNode) {
        const element = sel.focusNode.tagName
          ? sel.focusNode
          : sel.focusNode.parentElement;
        if (element && element.isContentEditable) {
          element.id = `${this.sections.type}Edit`;
          style = window.getComputedStyle(element);
          // compute additional properties
          style.textDecorationStack = []; // array of text-decoration strings from parent elements
          style.headerLevel = 0;
          style.isList = false;
          let parent = element;
          // while (parent) {
          //   const parent_style = window.getComputedStyle(parent);
          //   // stack CSS text-decoration as it is not overridden by children
          //   style.textDecorationStack.push(parent_style.textDecoration);
          //   // check if one parent is a list-item
          //   if (parent_style.display == "list-item") style.isList = true;
          //   // get first header level, if any
          //   if (!style.headerLevel) {
          //     for (let i = 1; i <= 6; i++) {
          //       if (parent.tagName.toUpperCase() == "H" + i) {
          //         style.headerLevel = i;
          //         break;
          //       }
          //     }
          //   }
          //   parent = parent.parentElement;
          // }
        }
      }
      this.current_text_style = style;
    },

    // Process the specific style (position and size) of each page <div> and content <div>
    page_style(page_idx, allow_overflow) {
      const px_in_mm = 0.2645833333333;
      const page_width = this.page_format_mm[0] / px_in_mm;
      const page_spacing_mm = 10;
      const page_with_plus_spacing =
        ((page_spacing_mm + this.page_format_mm[0]) * this.zoom) / px_in_mm;
      const view_padding = 20;
      const inner_width = this.editor_width - 2 * view_padding;
      let nb_pages_x = 1,
        page_column,
        x_pos,
        x_ofx,
        left_px,
        top_mm,
        bkg_width_mm,
        bkg_height_mm;
      if (this.display == "horizontal") {
        if (inner_width > this.pages.length * page_with_plus_spacing) {
          nb_pages_x = Math.floor(inner_width / page_with_plus_spacing);
          left_px =
            (inner_width / (nb_pages_x * 2)) * (1 + page_idx * 2) -
            page_width / 2;
        } else {
          nb_pages_x = this.pages.length;
          left_px =
            page_with_plus_spacing * page_idx +
            (page_width / 2) * (this.zoom - 1);
        }
        top_mm = 0;
        bkg_width_mm =
          this.zoom *
          (this.page_format_mm[0] * nb_pages_x +
            (nb_pages_x - 1) * page_spacing_mm);
        bkg_height_mm = this.page_format_mm[1] * this.zoom;
      } else {
        // "grid", vertical
        nb_pages_x = Math.floor(inner_width / page_with_plus_spacing);
        if (nb_pages_x < 1 || this.display == "vertical") nb_pages_x = 1;
        page_column = page_idx % nb_pages_x;
        x_pos =
          (inner_width / (nb_pages_x * 2)) * (1 + page_column * 2) -
          page_width / 2;
        x_ofx = Math.max(0, (page_width * this.zoom - inner_width) / 2);
        left_px = x_pos + x_ofx;
        top_mm =
          (this.page_format_mm[1] + page_spacing_mm) *
          this.zoom *
          Math.floor(page_idx / nb_pages_x);
        const nb_pages_y = Math.ceil(this.pages.length / nb_pages_x);
        bkg_width_mm =
          this.zoom *
          (this.page_format_mm[0] * nb_pages_x +
            (nb_pages_x - 1) * page_spacing_mm);
        bkg_height_mm =
          this.zoom *
          (this.page_format_mm[1] * nb_pages_y +
            (nb_pages_y - 1) * page_spacing_mm);
      }
      if (page_idx >= 0) {
        const style = {
          position: "absolute",
          left: "calc(" + left_px + "px + " + view_padding + "px)",
          top: "calc(" + top_mm + "mm + " + view_padding + "px)",
          width: this.page_format_mm[0] + "mm",
          backgrounColor: "white",
          // "height" is set below
          padding:
            typeof this.page_margins == "function"
              ? this.page_margins(page_idx + 1, this.pages.length)
              : this.page_margins,
          transform: "scale(" + this.zoom + ")",
        };
        style[allow_overflow ? "minHeight" : "height"] =
          this.page_format_mm[1] + "mm";
        return style;
      } else {
        // Content/background <div> is sized so it lets a margin around pages when scrolling at the end
        return {
          width: "calc(" + bkg_width_mm + "mm + " + 2 * view_padding + "px)",
          height: "calc(" + bkg_height_mm + "mm + " + 2 * view_padding + "px)",
        };
      }
    },

    // Utility to convert page_style to CSS string
    css_to_string: (css) =>
      Object.entries(css)
        .map(
          ([k, v]) =>
            k.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase()) + ":" + v
        )
        .join(";"),

    // Update pages <div> from this.pages data
    update_pages_elts() {
      // Removing deleted pages
      const deleted_pages = [...this.$refs.content?.children].filter(
        (page_elt) => !this.pages.find((page) => page.elt == page_elt)
      );
      for (const page_elt of deleted_pages) {
        page_elt.remove();
      }

      // Adding / updating pages
      for (const [page_idx, page] of this.pages.entries()) {
        // Get either existing page_elt or create it
        if (!page.elt) {
          page.elt = document.createElement("div");
          page.elt.className = "page";
          page.elt.dataset.isVDEPage = "";
          const next_page = this.pages[page_idx + 1];
          this.$refs.content.insertBefore(
            page.elt,
            next_page ? next_page.elt : null
          );
        }
        // Update page properties
        page.elt.dataset.contentIdx = page.content_idx;
        if (!this.printing_mode)
          page.elt.style = Object.entries(
            this.page_style(page_idx, page.template ? false : true)
          )
            .map(
              ([k, v]) =>
                k.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase()) +
                ":" +
                v
            )
            .join(";"); // (convert page_style to CSS string)
        page.elt.contentEditable =
          this.editable && !page.template ? true : false;
      }
    },

    // Get and store empty editor <div> width
    update_editor_width() {
      this.$refs.editor.classList.add("hide_children");
      this.editor_width = this.$refs.editor.clientWidth;
      this.update_pages_elts();
      this.$refs.editor.classList.remove("hide_children");
    },
    update_css_media_style() {
      this.css_media_style.innerHTML =
        "@media print { @page { size: " +
        this.page_format_mm[0] +
        "mm " +
        this.page_format_mm[1] +
        "mm; margin: 0 !important; } .hidden-print { display: none !important; } }";
    },

    // Prepare content before opening the native print box
    before_print() {
      // set the printing mode flag
      this.printing_mode = true;

      // store the current body aside
      this._page_body = document.body;

      // create a new body for the print and overwrite CSS
      const print_body = document.createElement("body");
      print_body.style.margin = "0";
      print_body.style.padding = "0";
      print_body.style.background = "white";
      print_body.style.font = window.getComputedStyle(this.$refs.editor).font;
      print_body.className = this.$refs.editor.className;

      // move each page to the print body
      for (const [page_idx, page] of this.pages.entries()) {
        //const page_clone = page_elt.cloneNode(true);
        page.elt.style = ""; // reset page style for the clone
        page.elt.style.position = "relative";
        page.elt.style.padding =
          typeof this.page_margins == "function"
            ? this.page_margins(page_idx + 1, this.pages.length)
            : this.page_margins;
        page.elt.style.breakBefore = page_idx ? "page" : "auto";
        page.elt.style.width = "calc(" + this.page_format_mm[0] + "mm - 2px)";
        page.elt.style.height = "calc(" + this.page_format_mm[1] + "mm - 2px)";
        page.elt.style.boxSizing = "border-box";
        page.elt.style.overflow = "hidden";

        // add overlays if any
        const overlay_elt = this.pages_overlay_refs[page.uuid];
        if (overlay_elt) {
          overlay_elt.style.position = "absolute";
          overlay_elt.style.left = "0";
          overlay_elt.style.top = "0";
          overlay_elt.style.transform = "none";
          overlay_elt.style.padding = "0";
          overlay_elt.style.overflow = "hidden";
          page.elt.prepend(overlay_elt);
        }

        print_body.append(page.elt);
      }

      // display a return arrow to let the user restore the original body in case the navigator doesn't call after_print() (it happens sometimes in Chrome)
      const return_overlay = document.createElement("div");
      return_overlay.className = "hidden-print"; // css managed in update_css_media_style method
      return_overlay.style.position = "fixed";
      return_overlay.style.left = "0";
      return_overlay.style.top = "0";
      return_overlay.style.right = "0";
      return_overlay.style.bottom = "0";
      return_overlay.style.display = "flex";
      return_overlay.style.alignItems = "center";
      return_overlay.style.justifyContent = "center";
      return_overlay.style.background = "rgba(255, 255, 255, 0.95)";
      return_overlay.style.cursor = "pointer";
      return_overlay.innerHTML =
        '<svg width="220" height="220"><path fill="rgba(0, 0, 0, 0.7)" d="M120.774,179.271v40c47.303,0,85.784-38.482,85.784-85.785c0-47.3-38.481-85.782-85.784-85.782H89.282L108.7,28.286L80.417,0L12.713,67.703l67.703,67.701l28.283-28.284L89.282,87.703h31.492c25.246,0,45.784,20.538,45.784,45.783C166.558,158.73,146.02,179.271,120.774,179.271z"/></svg>';
      return_overlay.addEventListener("click", this.after_print);
      print_body.append(return_overlay);

      // replace current body by the print body
      document.body = print_body;
    },

    // Restore content after closing the native print box
    after_print() {
      // clear the printing mode flag
      this.printing_mode = false;

      // restore pages and overlays

      for (const [page_idx, page] of this.pages.entries()) {
        console.log(page);
        page.elt.style = this.css_to_string(
          this.page_style(page_idx, page.template ? false : true)
        );
        this.$refs.content.append(page.elt);
        const overlay_elt = this.pages_overlay_refs[page.uuid];
        if (overlay_elt) {
          overlay_elt.style = this.css_to_string(
            this.page_style(page_idx, false)
          );
          this.$refs.overlays.append(overlay_elt);
        }
      }
      document.body = this._page_body;

      // recompute editor with and reposition elements
      this.update_editor_width();
    },
  },

  // Watch for changes and adapt content accordingly
  watch: {
    content: {
      handler() {
        // prevent infinite loop as reset_content triggers a content update and it's async
        if (this.prevent_next_content_update_from_parent) {
          this.prevent_next_content_update_from_parent = false;
        } else this.reset_content();
      },
      deep: true,
    },
    display: {
      handler() {
        this.update_pages_elts();
      },
    },
    page_format_mm: {
      handler() {
        this.update_css_media_style();
        this.reset_content();
      },
    },
    page_margins: {
      handler() {
        this.reset_content();
      },
    },
    zoom: {
      handler() {
        this.update_pages_elts();
      },
    },
  },
};
</script>

<style>
body {
  /* Enable printing of background colors */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>
<style scoped>
.editor {
  display: block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: default;
  padding-top: 64px;
}
.editor ::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
.editor ::-webkit-scrollbar-track,
.editor ::-webkit-scrollbar-corner {
  display: none;
}
.editor ::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  border: 5px solid transparent;
  border-radius: 16px;
  background-clip: content-box;
}
.editor ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.editor .hide_children > * {
  display: none;
}
.editor > .content {
  position: relative;
  outline: none;
  margin: 0;
  padding: 0;
  min-width: 100%;
  pointer-events: none;
}
.editor > .content > :deep(.page) {
  position: absolute;
  box-sizing: border-box;
  left: 50%;
  transform-origin: center top;
  background: var(--page-background, white);
  box-shadow: var(--page-box-shadow, 0 1px 3px 1px rgba(60, 64, 67, 0.15));
  border: var(--page-border);
  border-radius: var(--page-border-radius);
  transition: left 0.3s, top 0.3s;
  overflow: hidden;
  pointer-events: all;
}
.editor > .content > :deep(.page) > h1 {
  color: var(--Primary-Colors-Brand-Color-1-purple-900, #5233a1);
  /* Heading/md/SemiBold */
  font-family: Gilroy;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.editor > .content > :deep(.page) > h2 {
  color: var(--Primary-Colors-Brand-Color-1-purple-900, #10003a);
  /* Heading/md/SemiBold */
  font-family: Gilroy;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.editor > .content[contenteditable],
.editor > .content :deep(*[contenteditable]) {
  cursor: text;
}
.editor > .content :deep(*[contenteditable="false"]) {
  cursor: default;
}
.editor > .overlays {
  position: relative;
  margin: 0;
  padding: 0;
  min-width: 100%;
  pointer-events: none;
}
.editor > .overlays > .overlay {
  position: absolute;
  box-sizing: border-box;
  left: 50%;
  transform-origin: center top;
  transition: left 0.3s, top 0.3s;
  overflow: hidden;
  z-index: 1;
}
button {
  font-family: "Segoe UI", sans-serif;
  font-size: 16px;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235233a1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  padding-right: 2.5rem;
  font-family: "Gilroy", sans-serif;
  font-size: 14px;
  min-width: 120px;
}

select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(82, 51, 161, 0.2);
}

select option {
  padding: 8px;
  font-family: "Gilroy", sans-serif;
  font-size: 14px;
  color: #5233a1;
}

select option:hover {
  background-color: #f8f7fa;
}

/* Add styles for the image upload button */
button img {
  opacity: 0.7;
  transition: opacity 0.2s;
}

button:hover img {
  opacity: 1;
}
</style>
