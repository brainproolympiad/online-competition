import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/RichTextEditor.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { supabase } from '../../../supabaseClient';
export const RichTextEditor = ({ value, onChange, placeholder = 'Start typing...', compact = false, height = 400 }) => {
    const editorRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    // Your TinyMCE API key
    const TINYMCE_API_KEY = 'cafvm4l45vfwbnvcpsoi78h9z33b7vj0tp66afmzt0p5jkjh';
    // Handle image upload
    const handleImageUpload = async (blobInfo, progress) => {
        return new Promise(async (resolve, reject) => {
            try {
                setUploading(true);
                // Generate unique filename
                const fileExt = blobInfo.filename().split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const filePath = `quiz-images/${fileName}`;
                // Upload to Supabase Storage
                const { data, error } = await supabase.storage
                    .from('quiz-content')
                    .upload(filePath, blobInfo.blob(), {
                    cacheControl: '3600',
                    upsert: false
                });
                if (error) {
                    throw error;
                }
                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('quiz-content')
                    .getPublicUrl(filePath);
                resolve(publicUrl);
            }
            catch (error) {
                reject(error.message);
            }
            finally {
                setUploading(false);
            }
        });
    };
    return (_jsxs("div", { className: `rich-text-editor ${compact ? 'compact' : ''} ${uploading ? 'uploading' : ''}`, children: [uploading && (_jsxs("div", { className: "upload-overlay", children: [_jsx("div", { className: "upload-spinner" }), _jsx("span", { children: "Uploading image..." })] })), _jsx(Editor, { apiKey: TINYMCE_API_KEY, onInit: (evt, editor) => (editorRef.current = editor), value: value, onEditorChange: onChange, init: {
                    height: compact ? 200 : height,
                    menubar: !compact,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                        'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                        'table', 'code', 'help', 'wordcount', 'emoticons', 'codesample',
                        'quickbars'
                    ],
                    toolbar: !compact ?
                        `undo redo | blocks | bold italic underline strikethrough | 
             alignleft aligncenter alignright alignjustify | 
             bullist numlist outdent indent | 
             table image media | 
             codesample emoticons | 
             removeformat code fullscreen` :
                        `bold italic | bullist numlist | 
             image table | 
             removeformat`,
                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
                    quickbars_insert_toolbar: 'quickimage quicktable',
                    // Advanced table features
                    table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                    // Image configuration
                    images_upload_handler: handleImageUpload,
                    images_reuse_filename: true,
                    image_caption: true,
                    image_advtab: true,
                    image_class_list: [
                        { title: 'Responsive', value: 'img-responsive' },
                        { title: 'Inline', value: 'img-inline' },
                        { title: 'Float Left', value: 'img-float-left' },
                        { title: 'Float Right', value: 'img-float-right' }
                    ],
                    // Media embedding
                    media_live_embeds: true,
                    // Code samples
                    codesample_languages: [
                        { text: 'HTML/XML', value: 'markup' },
                        { text: 'JavaScript', value: 'javascript' },
                        { text: 'CSS', value: 'css' },
                        { text: 'PHP', value: 'php' },
                        { text: 'Python', value: 'python' },
                        { text: 'Java', value: 'java' },
                        { text: 'C++', value: 'cpp' }
                    ],
                    // Content styling
                    content_style: `
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              color: #374151;
            }
            .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
              color: #9CA3AF;
              font-style: italic;
            }
            .img-responsive {
              max-width: 100%;
              height: auto;
            }
            .img-float-left {
              float: left;
              margin: 0 16px 16px 0;
            }
            .img-float-right {
              float: right;
              margin: 0 0 16px 16px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 16px 0;
            }
            table td, table th {
              border: 1px solid #D1D5DB;
              padding: 8px 12px;
              text-align: left;
            }
            table th {
              background-color: #F9FAFB;
              font-weight: 600;
            }
            .mce-tinymce {
              border-radius: 8px !important;
              border: 1px solid #D1D5DB !important;
            }
            .mce-top-part::before {
              box-shadow: none !important;
            }
          `,
                    // UI customization
                    skin: 'oxide',
                    icons: 'material',
                    branding: false,
                    promotion: false,
                    resize: true,
                    statusbar: !compact,
                    elementpath: !compact,
                    // Auto-save and recovery
                    autosave_ask_before_unload: true,
                    autosave_interval: '30s',
                    autosave_prefix: 'quiz-editor-' + new Date().getTime(),
                    autosave_restore_when_empty: true,
                    // Link configuration
                    link_assume_external_targets: true,
                    link_target_list: [
                        { title: 'Same page', value: '_self' },
                        { title: 'New page', value: '_blank' }
                    ],
                    // Templates for common question formats
                    templates: [
                        {
                            title: 'Multiple Choice Question',
                            description: 'Template for multiple choice questions',
                            content: `
                <div class="question-template">
                  <p><strong>Question:</strong></p>
                  <p>Enter your question here...</p>
                  <table style="width: 100%; margin-top: 16px;">
                    <tr>
                      <td style="width: 5%;"><strong>A)</strong></td>
                      <td>Option A</td>
                    </tr>
                    <tr>
                      <td><strong>B)</strong></td>
                      <td>Option B</td>
                    </tr>
                    <tr>
                      <td><strong>C)</strong></td>
                      <td>Option C</td>
                    </tr>
                    <tr>
                      <td><strong>D)</strong></td>
                      <td>Option D</td>
                    </tr>
                  </table>
                  <p style="margin-top: 16px;"><strong>Explanation:</strong></p>
                  <p>Add explanation here...</p>
                </div>
              `
                        }
                    ],
                    // Custom formats
                    style_formats: [
                        {
                            title: 'Headings', items: [
                                { title: 'Heading 1', format: 'h1' },
                                { title: 'Heading 2', format: 'h2' },
                                { title: 'Heading 3', format: 'h3' }
                            ]
                        },
                        {
                            title: 'Inline', items: [
                                { title: 'Bold', format: 'bold' },
                                { title: 'Italic', format: 'italic' },
                                { title: 'Underline', format: 'underline' },
                                { title: 'Strikethrough', format: 'strikethrough' },
                                { title: 'Code', format: 'code' }
                            ]
                        },
                        {
                            title: 'Blocks', items: [
                                { title: 'Paragraph', format: 'p' },
                                { title: 'Blockquote', format: 'blockquote' },
                                { title: 'Preformatted', format: 'pre' }
                            ]
                        }
                    ]
                } }), _jsx("style", { jsx: true, children: `
        .rich-text-editor {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rich-text-editor.compact :global(.mce-tinymce) {
          border-radius: 6px !important;
        }
        
        .rich-text-editor.uploading {
          opacity: 0.7;
          pointer-events: none;
        }
        
        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 1000;
          border-radius: 8px;
        }
        
        .upload-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #E5E7EB;
          border-top: 3px solid #3B82F6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 8px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        :global(.question-template) {
          border-left: 4px solid #3B82F6;
          padding-left: 16px;
          background: #F0F9FF;
          padding: 16px;
          border-radius: 4px;
        }
      ` })] }));
};
export default RichTextEditor;
