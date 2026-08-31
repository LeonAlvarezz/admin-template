import { describe, expect, it } from "bun:test";
import React from "react";
import {
  Upload,
  FileUpload,
  UploadLinkInput,
  UploadArea,
  UploadFileList,
  UploadItem,
} from "../src/components/ui/upload";

describe("Upload Component", () => {
  it("renders with default props", () => {
    const element = <Upload />;
    expect(element).toBeDefined();
  });

  it("aliases Upload to FileUpload and Upload.Root", () => {
    expect(FileUpload).toBe(Upload);
    expect(Upload.Root).toBe(Upload);
    expect(Upload.LinkInput).toBe(UploadLinkInput);
    expect(Upload.Area).toBe(UploadArea);
    expect(Upload.FileList).toBe(UploadFileList);
    expect(Upload.Item).toBe(UploadItem);
  });

  it("supports controlled value and link input configuration", () => {
    const items = [
      {
        id: "1",
        name: "test-image.png",
        size: 1024 * 50,
        type: "image/png",
        url: "https://example.com/test-image.png",
      },
    ];

    const element = (
      <Upload
        value={items}
        showLinkInput={true}
        linkInputPlaceholder="Paste CDN URL..."
        linkButtonText="Import"
        accept="image/*"
        maxSize={5 * 1024 * 1024}
      />
    );

    expect(element.props.value).toBe(items);
    expect(element.props.showLinkInput).toBe(true);
    expect(element.props.linkInputPlaceholder).toBe("Paste CDN URL...");
    expect(element.props.linkButtonText).toBe("Import");
    expect(element.props.accept).toBe("image/*");
    expect(element.props.maxSize).toBe(5 * 1024 * 1024);
  });

  it("supports compound composition", () => {
    const element = (
      <Upload.Root multiple accept="image/*,.pdf" disabled={false}>
        <Upload.LinkInput placeholder="Direct media link..." />
        <Upload.Area
          title="Drag and drop your receipts here"
          description="PDF or PNG up to 10MB"
        />
        <Upload.FileList />
      </Upload.Root>
    );

    expect(element.props.multiple).toBe(true);
    expect(element.props.accept).toBe("image/*,.pdf");
  });

  it("renders UploadItem with file and error state", () => {
    const item = {
      id: "item-1",
      name: "corrupted.png",
      size: 123456,
      type: "image/png",
      url: "blob:http://localhost/test",
      error: "File size exceeds 2MB",
    };

    const element = <UploadItem item={item} onRemove={() => {}} />;
    expect(element.props.item).toBe(item);
    expect(element.props.item.error).toBe("File size exceeds 2MB");
  });
});
