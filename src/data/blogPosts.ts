export const blogPosts = [
  {
    slug: 'async-sequence-notifications-swift',
    title: 'AsyncSequence in Swift: Events as Values Over Time',
    source: 'Swift Concurrency note',
    date: '2026-05-09',
    readTime: '5 min read',
    color: '#c8ead5',
    tags: ['Swift', 'Concurrency', 'AsyncSequence'],
    excerpt:
      'How AsyncSequence works, when to use it, and why notifications, streams and UI events become easier to reason about with for await.',
    sections: [
      {
        heading: 'What AsyncSequence solves',
        body:
          'Some values do not arrive once. They arrive over time: notifications, network updates, progress events, location changes, app lifecycle events or user-driven signals. AsyncSequence gives Swift a native way to model those values using structured concurrency instead of callbacks.',
      },
      {
        heading: 'The core idea',
        body:
          'An AsyncSequence is like a regular Sequence, but each next value may require waiting. Instead of a normal for loop, you consume it with for await. The loop suspends while waiting for the next element, then resumes when a new value arrives.',
      },
      {
        heading: 'NotificationCenter example',
        body:
          'A practical iOS example is observing app lifecycle notifications. NotificationCenter exposes an async notifications sequence, so you can consume app events with a regular-looking loop that suspends between values.',
        code: `final class AppLifecycleObserver {
    private var task: Task<Void, Never>?

    func start() {
        task = Task {
            let notifications = NotificationCenter.default.notifications(
                named: UIApplication.didBecomeActiveNotification
            )

            for await notification in notifications {
                handleAppDidBecomeActive(notification)
            }
        }
    }

    func stop() {
        task?.cancel()
        task = nil
    }

    private func handleAppDidBecomeActive(_ notification: Notification) {
        // Refresh state, resume timers, or trigger analytics.
    }
}`,
      },
      {
        heading: 'Cancellation matters',
        body:
          'AsyncSequence fits well with task cancellation. If the Task observing notifications is cancelled, the loop stops. In a view model, this means you can keep a Task reference and cancel it in deinit or when the feature is no longer visible.',
        code: `@MainActor
final class SessionViewModel: ObservableObject {
    private var appActiveTask: Task<Void, Never>?

    func bindAppLifecycle() {
        appActiveTask = Task {
            for await _ in NotificationCenter.default.notifications(
                named: UIApplication.didBecomeActiveNotification
            ) {
                await reloadSessionIfNeeded()
            }
        }
    }

    deinit {
        appActiveTask?.cancel()
    }
}`,
      },
      {
        heading: 'Creating your own stream',
        body:
          'When you need to bridge delegate callbacks or custom events, AsyncStream is often the simplest tool. You create AsyncStream<Event> { continuation in ... } and call continuation.yield(event) whenever a callback arrives. When the source finishes, call continuation.finish().',
        code: `enum DownloadEvent {
    case progress(Double)
    case finished(URL)
}

func downloadEvents() -> AsyncStream<DownloadEvent> {
    AsyncStream { continuation in
        let downloader = Downloader()

        downloader.onProgress = { value in
            continuation.yield(.progress(value))
        }

        downloader.onFinish = { fileURL in
            continuation.yield(.finished(fileURL))
            continuation.finish()
        }

        continuation.onTermination = { _ in
            downloader.cancel()
        }

        downloader.start()
    }
}`,
      },
      {
        heading: 'Why senior iOS engineers should care',
        body:
          'AsyncSequence makes event-driven code easier to test, cancel and compose. It also reduces callback nesting and helps teams express time-based behavior clearly. The important habit is to define ownership: who creates the stream, who consumes it, and when cancellation happens.',
      },
    ],
  },
  {
    slug: 'swiftui-state-boundaries',
    title: 'Tutorial: Modeling SwiftUI Screen State',
    source: 'SwiftUI tutorial',
    date: '2026-05-09',
    readTime: '6 min read',
    color: '#d1e9c6',
    tags: ['SwiftUI', 'Architecture', 'State'],
    excerpt:
      'A practical walkthrough for replacing scattered booleans with one explicit state model that a real screen can render safely.',
    sections: [
      {
        heading: 'Start with the screen contract',
        body:
          'Before writing the view, list the states a user can actually see. A production screen is rarely just data or no data. It can be idle, loading, ready, empty, failed, refreshing or showing stale data. Naming those states first makes the UI easier to reason about.',
      },
      {
        heading: 'Create one state enum',
        body:
          'A common mistake is spreading state across isLoading, items, errorMessage and hasLoadedOnce. That works until two flags disagree. Prefer one screen state that represents the truth the view should render.',
        code: `enum OrdersScreenState {
    case idle
    case loading
    case empty
    case loaded([Order])
    case failed(message: String)
}`,
      },
      {
        heading: 'Render every case explicitly',
        body:
          'Now the SwiftUI body becomes a mapping from state to UI. This is the useful discipline: if product adds a retry state or an offline state, the compiler guides the implementation instead of hiding the missing path.',
        code: `struct OrdersView: View {
    let state: OrdersScreenState

    var body: some View {
        switch state {
        case .idle, .loading:
            ProgressView()
        case .empty:
            EmptyOrdersView()
        case .loaded(let orders):
            OrdersList(orders: orders)
        case .failed(let message):
            ErrorStateView(message: message)
        }
    }
}`,
      },
      {
        heading: 'Keep local UI state local',
        body:
          'Not everything belongs in the feature state. Sheet presentation, focused fields, temporary animation toggles and local selection can stay close to the view. The boundary is product meaning: if product, analytics, deep links or recovery logic care about it, model it deliberately.',
      },
      {
        heading: 'The payoff',
        body:
          'This pattern makes previews, tests and code reviews better. You can build one preview per state, assert state transitions in the view model, and discuss behavior with product using the same names that appear in code.',
      },
    ],
  },
  {
    slug: 'swift-api-design-gems',
    title: 'Opinion: What A Philosophy of Software Design Gets Right',
    source: 'Book opinion',
    date: '2026-05-09',
    readTime: '5 min read',
    color: '#f2e6bc',
    tags: ['Books', 'API Design', 'Architecture'],
    excerpt:
      "A mobile engineer perspective on why John Ousterhout's book is useful, where it is strongest, and how I apply it in Swift code.",
    sections: [
      {
        heading: 'The idea that stayed with me',
        body:
          'The book argues that complexity is the real enemy, and that good design hides complexity behind deep modules. I like that framing because it moves the conversation away from style debates and toward the question that matters: does this boundary make the next change easier?',
      },
      {
        heading: 'Why it maps well to iOS',
        body:
          "Mobile apps accumulate complexity quickly: networking, cache, analytics, experiments, navigation, accessibility, design states and lifecycle behavior all meet in the same screen. The book's advice is useful because shallow abstractions are everywhere in app code. A wrapper that only forwards calls is not a design improvement.",
      },
      {
        heading: 'Where I would be careful',
        body:
          'I would not read the book as a command to create large abstract systems upfront. In product engineering, the wrong abstraction can slow the team down. For me, the practical version is: let the feature teach you where complexity repeats, then create a boundary that removes a real burden.',
      },
      {
        heading: 'How I apply it in Swift',
        body:
          'When reviewing Swift code, I ask whether the caller needs to know too much. If a view model must understand retry policy, cache freshness, transport errors and analytics naming, the module is probably too shallow. A better API lets the caller express intent and keeps operational detail behind the boundary.',
        code: `protocol SessionRefreshing {
    func refreshIfNeeded() async throws -> Session
}`,
      },
      {
        heading: 'My take',
        body:
          'It is a strong book for engineers who already know how to code and want better judgment around design. The most valuable habit is not memorizing rules; it is learning to notice when code makes every future change negotiate with too many details.',
      },
    ],
  },
  {
    slug: 'bytes-memory-performance-swift',
    title: 'Tutorial: Finding a Memory Problem in Swift',
    source: 'Swift performance tutorial',
    date: '2026-05-09',
    readTime: '6 min read',
    color: '#bfded2',
    tags: ['Swift', 'Performance', 'Memory'],
    excerpt:
      'A small diagnostic flow for investigating memory pressure before jumping into premature optimization.',
    sections: [
      {
        heading: 'Step 1: Reproduce the pressure',
        body:
          'Start with a repeatable action: open a screen, scroll a list, decode a payload, process images or repeat a navigation flow. If the problem cannot be reproduced, optimization turns into guessing. Use a real device when possible because simulator behavior can hide important costs.',
      },
      {
        heading: 'Step 2: Look for ownership first',
        body:
          'Before touching algorithms, check whether objects are released. Retain cycles in closures, long-lived tasks, image caches and notification observers can make memory grow even when the code looks innocent.',
        code: `final class ProfileViewModel {
    private var task: Task<Void, Never>?

    func load() {
        task = Task { [weak self] in
            guard let self else { return }
            await self.fetchProfile()
        }
    }

    deinit {
        task?.cancel()
    }
}`,
      },
      {
        heading: 'Step 3: Measure allocations',
        body:
          'Use Instruments to watch allocations while performing the same action several times. You are looking for patterns: repeated large allocations, data that never drops, image buffers that stay alive, or transformations that create many temporary values.',
      },
      {
        heading: 'Step 4: Reduce data movement',
        body:
          'In Swift, performance issues often come from moving too much data too often. Avoid decoding the same payload repeatedly, resizing images on the main thread, building giant intermediate arrays, or copying large values through layers that do not need ownership.',
      },
      {
        heading: 'Step 5: Verify the user impact',
        body:
          'The final question is not whether the code is clever. It is whether the screen scrolls smoothly, memory stabilizes, startup remains fast and the app survives real user sessions. Measure before and after, then keep the simplest fix that changes the user experience.',
      },
    ],
  },
  {
    slug: 'observable-ios-systems',
    title: 'Tutorial: Adding Observability to an iOS Feature',
    source: 'Production iOS tutorial',
    date: '2026-05-09',
    readTime: '6 min read',
    color: '#cfe1bf',
    tags: ['iOS', 'Observability', 'Reliability'],
    excerpt:
      'A lightweight instrumentation plan for designing logs, metrics and user-journey signals before release.',
    sections: [
      {
        heading: 'Define the journey',
        body:
          'Start by writing the journey in plain language: user enters the screen, data loads, user takes an action, the app calls a service, the result is shown. Those moments become your candidate signals. If you cannot describe the journey, the instrumentation will be random.',
      },
      {
        heading: 'Track decisions, not noise',
        body:
          'Good observability is not a log line after every function call. Track decisions that help answer production questions: did the user enter the flow, did data come from cache or network, did retry happen, did the user recover from an error, did the journey complete?',
        code: `enum CheckoutSignal {
    case screenViewed
    case loadStarted(source: DataSource)
    case loadFailed(reason: String)
    case retryTapped
    case purchaseCompleted
}`,
      },
      {
        heading: 'Separate product events from debug logs',
        body:
          'Analytics, metrics and logs answer different questions. Product events explain behavior. Metrics explain health and scale. Logs explain specific failures. Mixing all three into one vague event makes every dashboard less useful.',
      },
      {
        heading: 'Include failure context',
        body:
          'When a request fails, capture enough context to investigate without leaking sensitive data. Error category, endpoint name, feature area, retry count, cache state and app version are often more useful than a raw error string.',
      },
      {
        heading: 'Review it before launch',
        body:
          'Observability should be part of the feature review. Ask: if this breaks for 5 percent of users tomorrow, what will we know? If the answer is not enough, add the signal before shipping.',
      },
    ],
  },
  {
    slug: 'swiftui-product-polish',
    title: 'Field Guide: SwiftUI Product Polish',
    source: 'Product engineering guide',
    date: '2026-05-09',
    readTime: '5 min read',
    color: '#e1f1db',
    tags: ['SwiftUI', 'UX', 'Product'],
    excerpt:
      'A product-engineering checklist for the small interaction details that make a native screen feel intentional.',
    sections: [
      {
        heading: 'Check the first second',
        body:
          'The first second tells the user whether the app feels alive. Show a useful loading state, avoid layout jumps, keep primary actions stable and make sure the screen does not flash through impossible states while data arrives.',
      },
      {
        heading: 'Design empty and error states',
        body:
          'Empty and error states are not edge cases for users. They are part of the product. A polished screen explains what happened, offers the next useful action and avoids blaming the user for system limitations.',
      },
      {
        heading: 'Respect touch, text and motion',
        body:
          'Check tap targets, Dynamic Type, VoiceOver labels, keyboard movement, reduced motion and long localized strings. A screen that only works with ideal English copy and default text size is not finished.',
      },
      {
        heading: 'Preview the real matrix',
        body:
          'Use SwiftUI previews to make polish visible during development. Create previews for loading, empty, error, long content and narrow device widths. It is much cheaper to catch broken layout before the feature reaches QA.',
        code: `#Preview("Empty") {
    OrdersView(state: .empty)
}

#Preview("Error") {
    OrdersView(state: .failed(message: "We could not load your orders."))
}

#Preview("Loaded") {
    OrdersView(state: .loaded(Order.samples))
}`,
      },
      {
        heading: 'The product signal',
        body:
          "Great polish is not decoration. It is the feeling that the team anticipated the user's situation. In a strong product team, engineers can discuss those details with the same seriousness as architecture or performance.",
      },
    ],
  },
] as const;

export type BlogPost = (typeof blogPosts)[number];
