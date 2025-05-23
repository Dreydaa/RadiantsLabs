import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

Font.register({
  family: 'Source Code Pro',
  src: 'https://fonts.gstatic.com/s/sourcecodepro/v22/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DMyQtMlrTA.woff2'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Inter'
  },
  section: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  subheading: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5
  },
  code: {
    fontFamily: 'Source Code Pro',
    fontSize: 10,
    backgroundColor: '#F8F9FA',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4
  },
  tableOfContents: {
    marginBottom: 30
  },
  tocItem: {
    fontSize: 12,
    marginBottom: 5
  }
});

// Code snippets
const codeSnippets = {
  authMiddleware: `
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify JWT token
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response(
    JSON.stringify({ error: 'No authorization header' }),
    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

const token = authHeader.replace('Bearer ', '');
const { data: { user }, error: userError } = await supabase.auth.getUser(token);

if (userError || !user) {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}`,

  errorHandling: `
try {
  // API logic here
} catch (error) {
  return new Response(
    JSON.stringify({ error: error.message }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}`
};

function Documentation() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title}>Radiants Labs Backend Documentation</Text>
        </View>

        {/* Table of Contents */}
        <View style={styles.tableOfContents}>
          <Text style={styles.heading}>Table of Contents</Text>
          <Text style={styles.tocItem}>1. Architecture Overview</Text>
          <Text style={styles.tocItem}>2. Database Schema</Text>
          <Text style={styles.tocItem}>3. Authentication & Authorization</Text>
          <Text style={styles.tocItem}>4. API Endpoints</Text>
          <Text style={styles.tocItem}>5. Error Handling</Text>
          <Text style={styles.tocItem}>6. Testing Strategy</Text>
          <Text style={styles.tocItem}>7. TypeScript Benefits</Text>
        </View>

        {/* Architecture Overview */}
        <View style={styles.section}>
          <Text style={styles.heading}>1. Architecture Overview</Text>
          <Text style={styles.text}>
            The backend architecture is built on Supabase Edge Functions using TypeScript and Deno.
            Key components include:
          </Text>
          <Text style={styles.text}>
            • Authentication Service
            • Team Management
            • Messaging System
            • Practice Organization
            • Blueprint Management
          </Text>
        </View>

        {/* Database Schema */}
        <View style={styles.section}>
          <Text style={styles.heading}>2. Database Schema</Text>
          <Text style={styles.text}>
            The database uses PostgreSQL with the following core tables:
          </Text>
          <Text style={styles.text}>
            • teams: Stores team information and relationships
            • messages: Handles direct and group messaging
            • blueprints: Stores tactical strategies and drawings
            • practice_requests: Manages team practice scheduling
          </Text>
        </View>

        {/* Authentication & Authorization */}
        <View style={styles.section}>
          <Text style={styles.heading}>3. Authentication & Authorization</Text>
          <Text style={styles.text}>
            Authentication is handled through Supabase Auth with JWT tokens.
            Row Level Security (RLS) policies ensure data access control.
          </Text>
          <View style={styles.code}>
            <SyntaxHighlighter language="typescript" style={tomorrow}>
              {codeSnippets.authMiddleware}
            </SyntaxHighlighter>
          </View>
        </View>
      </Page>

      <Page style={styles.page}>
        {/* API Endpoints */}
        <View style={styles.section}>
          <Text style={styles.heading}>4. API Endpoints</Text>
          <Text style={styles.subheading}>Teams API</Text>
          <Text style={styles.text}>
            POST /teams - Create a new team
            GET /teams/:id - Get team details
            PUT /teams/:id - Update team information
            DELETE /teams/:id - Delete a team
          </Text>
          
          <Text style={styles.subheading}>Messages API</Text>
          <Text style={styles.text}>
            POST /messages - Send a new message
            GET /messages/:chatId - Get chat messages
            PUT /messages/:id - Update message status
          </Text>
        </View>

        {/* Error Handling */}
        <View style={styles.section}>
          <Text style={styles.heading}>5. Error Handling</Text>
          <Text style={styles.text}>
            Comprehensive error handling strategy with standardized error responses
            and status codes.
          </Text>
          <View style={styles.code}>
            <SyntaxHighlighter language="typescript" style={tomorrow}>
              {codeSnippets.errorHandling}
            </SyntaxHighlighter>
          </View>
        </View>

        {/* Testing Strategy */}
        <View style={styles.section}>
          <Text style={styles.heading}>6. Testing Strategy</Text>
          <Text style={styles.text}>
            • Unit Tests: Testing individual functions and components
            • Integration Tests: Testing API endpoints and database operations
            • E2E Tests: Testing complete user flows
            • Coverage Requirements: Minimum 80% code coverage
          </Text>
        </View>

        {/* TypeScript Benefits */}
        <View style={styles.section}>
          <Text style={styles.heading}>7. TypeScript Benefits</Text>
          <Text style={styles.text}>
            TypeScript was chosen for its strong type system and developer tooling:
          </Text>
          <Text style={styles.text}>
            • Type Safety: Catches errors at compile time
            • Better IDE Support: Enhanced autocomplete and refactoring
            • Code Maintainability: Self-documenting code through types
            • Team Collaboration: Clear interfaces and contracts
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default Documentation;