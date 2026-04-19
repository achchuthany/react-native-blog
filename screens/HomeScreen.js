import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { COLORS } from "../utils/colors";
import { useEffect, useState } from "react";
import { apiClient } from "../utils/api";

const PAGE_SIZE = 10;

// Separate function to fetch posts with pagination
async function fetchPostsWithPagination(page = 1, limit = PAGE_SIZE) {
  try {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    console.log("🔄 Fetching posts with page:", pageNum, "limit:", limitNum);

    const response = await apiClient.get("/posts", {
      params: {
        page: pageNum,
        limit: limitNum,
      },
    });

    console.log("✅ Posts API Response:", response.data);

    // Handle both response structures
    const responseData = response.data.data || response.data;
    const posts = responseData.posts || [];
    const pagination = responseData.pagination || {};

    console.log(
      "📊 Extracted:",
      posts.length,
      "posts, pagination:",
      pagination,
    );

    return {
      posts,
      pagination,
    };
  } catch (error) {
    const errorResponse = error.response?.data;
    const errorMessage = errorResponse?.message || error.message;
    const errorStatus = error.response?.status;

    console.error("❌ Error fetching posts:", {
      status: errorStatus,
      message: errorMessage,
      fullResponse: errorResponse,
      url: error.config?.url,
      params: error.config?.params,
    });
    throw error;
  }
}

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initial fetch
  useEffect(() => {
    loadInitialPosts();
  }, []);

  // Load first page of posts
  async function loadInitialPosts() {
    setLoading(true);
    try {
      const data = await fetchPostsWithPagination(1, PAGE_SIZE);
      setPosts(data.posts);
      setPagination(data.pagination);
      setHasMore(data.posts.length === PAGE_SIZE);
    } catch (error) {
      console.error(
        "Failed to load posts:",
        error.response?.data || error.message,
      );
      Alert.alert("Error", "Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Load next page of posts
  async function loadMorePosts() {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const nextPage = (pagination.page || pagination.currentPage || 1) + 1;
      console.log("Loading page:", nextPage);

      const data = await fetchPostsWithPagination(nextPage, PAGE_SIZE);

      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setPagination(data.pagination);

      // Check if there are more pages
      const hasMorePages = data.posts.length === PAGE_SIZE;
      setHasMore(hasMorePages);
      console.log("Loaded", data.posts.length, "posts, hasMore:", hasMorePages);
    } catch (error) {
      console.error(
        "Failed to load more posts:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  }

  // Pull to refresh
  async function handleRefresh() {
    setRefreshing(true);
    try {
      const data = await fetchPostsWithPagination(1, PAGE_SIZE);
      setPosts(data.posts);
      setPagination(data.pagination);
      setHasMore(data.posts.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to refresh posts:", error);
    } finally {
      setRefreshing(false);
    }
  }

  // Render individual post item
  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.postMeta}>
        <Text style={styles.postAuthor}>{item.author_name}</Text>
        <Text style={styles.postDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  // Render footer (loading indicator)
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  };

  // Render empty list
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No posts available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  postAuthor: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  postDate: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
