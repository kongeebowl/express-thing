import {
  getPaginationOptions,
  createPaginatedResponse,
} from "../../utils/pagination.js";

describe("Pagination", () => {
  describe("getPaginationOptions", () => {
    it("should return default pagination options", () => {
      const options = getPaginationOptions({});
      expect(options.page).toBe(1);
      expect(options.limit).toBe(10);
    });

    it("should parse page and limit from query", () => {
      const options = getPaginationOptions({ page: "2", limit: "20" });
      expect(options.page).toBe(2);
      expect(options.limit).toBe(20);
    });

    it("should enforce minimum page of 1", () => {
      const options = getPaginationOptions({ page: "0" });
      expect(options.page).toBe(1);
    });

    it("should enforce maximum limit of 100", () => {
      const options = getPaginationOptions({ limit: "200" });
      expect(options.limit).toBe(100);
    });
  });

  describe("createPaginatedResponse", () => {
    it("should create correct paginated response", () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const response = createPaginatedResponse(data, 25, 1, 10);

      expect(response.data).toEqual(data);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(10);
      expect(response.pagination.total).toBe(25);
      expect(response.pagination.pages).toBe(3);
      expect(response.pagination.hasNext).toBe(true);
      expect(response.pagination.hasPrev).toBe(false);
    });

    it("should set hasNext to false on last page", () => {
      const response = createPaginatedResponse([], 25, 3, 10);
      expect(response.pagination.hasNext).toBe(false);
      expect(response.pagination.hasPrev).toBe(true);
    });
  });
});
