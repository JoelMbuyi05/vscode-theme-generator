// DOM Elements
    const controls = {
      themeName: document.getElementById('themeName'),
      editorBackground: document.getElementById('editorBackground'),
      editorForeground: document.getElementById('editorForeground'),
      keywordColor: document.getElementById('keywordColor'),
      stringColor: document.getElementById('stringColor'),
      functionColor: document.getElementById('functionColor'),
      commentColor: document.getElementById('commentColor'),
      sidebarBackground: document.getElementById('sidebarBackground'),
      sidebarForeground: document.getElementById('sidebarForeground'),
      selectionColor: document.getElementById('selectionColor'),
    };

    const hexInputs = {
      editorBg: document.getElementById('editorBgHex'),
      editorFg: document.getElementById('editorFgHex'),
      keyword: document.getElementById('keywordHex'),
      string: document.getElementById('stringHex'),
      function: document.getElementById('functionHex'),
      comment: document.getElementById('commentHex'),
      sidebarBg: document.getElementById('sidebarBgHex'),
      sidebarFg: document.getElementById('sidebarFgHex'),
      selection: document.getElementById('selectionHex'),
    };

    const previews = {
      editor: document.getElementById('editor-preview'),
      sidebar: document.getElementById('sidebar-preview'),
      json: document.getElementById('themeJson'),
      palette: document.getElementById('colorPalette'),
    };

    const buttons = {
      save: document.getElementById('saveTheme'),
      export: document.getElementById('exportTheme'),
      random: document.getElementById('randomTheme'),
      reset: document.getElementById('resetTheme'),
      import: document.getElementById('importTheme'),
      copyJson: document.getElementById('copyJson'),
    };

    const STORAGE_KEY = 'vscode-themes-list';

    // Helper Functions
    function makeThemeObject() {
      return {
        name: controls.themeName.value.trim() || `Theme-${Date.now()}`,
        editorBackground: controls.editorBackground.value,
        editorForeground: controls.editorForeground.value,
        keyword: controls.keywordColor.value,
        string: controls.stringColor.value,
        function: controls.functionColor.value,
        comment: controls.commentColor.value,
        sidebarBackground: controls.sidebarBackground.value,
        sidebarForeground: controls.sidebarForeground.value,
        selection: controls.selectionColor.value,
      };
    }

    function applyTheme(theme) {
      controls.themeName.value = theme.name || '';
      controls.editorBackground.value = theme.editorBackground;
      controls.editorForeground.value = theme.editorForeground;
      controls.keywordColor.value = theme.keyword;
      controls.stringColor.value = theme.string;
      controls.functionColor.value = theme.function;
      controls.commentColor.value = theme.comment || '#6a9955';
      controls.sidebarBackground.value = theme.sidebarBackground;
      controls.sidebarForeground.value = theme.sidebarForeground;
      controls.selectionColor.value = theme.selection || '#264f78';
      applyAllColors();
    }

    function updateHexInputs() {
      hexInputs.editorBg.value = controls.editorBackground.value;
      hexInputs.editorFg.value = controls.editorForeground.value;
      hexInputs.keyword.value = controls.keywordColor.value;
      hexInputs.string.value = controls.stringColor.value;
      hexInputs.function.value = controls.functionColor.value;
      hexInputs.comment.value = controls.commentColor.value;
      hexInputs.sidebarBg.value = controls.sidebarBackground.value;
      hexInputs.sidebarFg.value = controls.sidebarForeground.value;
      hexInputs.selection.value = controls.selectionColor.value;
    }

    function applyAllColors() {
      const theme = makeThemeObject();

      // Apply to editor
      previews.editor.style.background = theme.editorBackground;
      previews.editor.style.color = theme.editorForeground;

      // Apply syntax colors
      document.querySelectorAll('#editor-preview .keyword').forEach(el => el.style.color = theme.keyword);
      document.querySelectorAll('#editor-preview .string').forEach(el => el.style.color = theme.string);
      document.querySelectorAll('#editor-preview .function').forEach(el => el.style.color = theme.function);
      document.querySelectorAll('#editor-preview .comment').forEach(el => el.style.color = theme.comment);

      // Apply to sidebar
      previews.sidebar.style.background = theme.sidebarBackground;
      previews.sidebar.style.color = theme.sidebarForeground;

      updateHexInputs();
      updateJsonPreview();
      updateColorPalette();
      autosaveTheme();
    }

    function updateJsonPreview() {
      const theme = makeThemeObject();
      const output = {
        name: theme.name,
        type: 'dark',
        colors: {
          'editor.background': theme.editorBackground,
          'editor.foreground': theme.editorForeground,
          'editor.selectionBackground': theme.selection,
          'sideBar.background': theme.sidebarBackground,
          'sideBar.foreground': theme.sidebarForeground,
        },
        tokenColors: [
          { scope: ['keyword'], settings: { foreground: theme.keyword, fontStyle: 'bold' } },
          { scope: ['string'], settings: { foreground: theme.string } },
          { scope: ['entity.name.function'], settings: { foreground: theme.function } },
          { scope: ['comment'], settings: { foreground: theme.comment, fontStyle: 'italic' } },
        ]
      };
      previews.json.textContent = JSON.stringify(output, null, 2);
    }

    function updateColorPalette() {
      const theme = makeThemeObject();
      const colors = [
        { label: 'Editor BG', value: theme.editorBackground },
        { label: 'Editor Text', value: theme.editorForeground },
        { label: 'Keywords', value: theme.keyword },
        { label: 'Strings', value: theme.string },
        { label: 'Functions', value: theme.function },
        { label: 'Comments', value: theme.comment },
        { label: 'Sidebar BG', value: theme.sidebarBackground },
        { label: 'Sidebar Text', value: theme.sidebarForeground },
      ];

      previews.palette.innerHTML = colors.map(c => `
        <div class="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded" style="background: ${c.value}; border: 1px solid rgba(59, 130, 246, 0.3);"></div>
            <span class="text-sm">${c.label}</span>
          </div>
          <span class="text-xs font-mono text-gray-400">${c.value}</span>
        </div>
      `).join('');
    }

    function getSavedThemes() {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }

    function setSavedThemes(list) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function renderSavedThemes() {
      const list = getSavedThemes();
      const container = document.getElementById('savedThemes');

      if (!list.length) {
        container.innerHTML = '<p class="text-xs text-gray-400">No saved themes yet</p>';
        return;
      }

      container.innerHTML = list.map((t, idx) => `
        <div class="theme-card glass-effect p-3 rounded-lg">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div class="w-6 h-6 rounded flex-shrink-0" style="background: ${t.editorBackground}; border: 1px solid rgba(59, 130, 246, 0.3);"></div>
              <span class="text-xs font-semibold truncate">${t.name}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button data-load="${idx}" class="flex-1 text-xs bg-blue-600/50 hover:bg-blue-600 py-1 rounded transition-colors">Load</button>
            <button data-delete="${idx}" class="flex-1 text-xs bg-red-600/50 hover:bg-red-600 py-1 rounded transition-colors">Delete</button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('[data-load]').forEach(btn => {
        btn.addEventListener('click', () => {
          const list = getSavedThemes();
          applyTheme(list[Number(btn.getAttribute('data-load'))]);
        });
      });

      document.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', () => {
          let list = getSavedThemes();
          list.splice(Number(btn.getAttribute('data-delete')), 1);
          setSavedThemes(list);
          renderSavedThemes();
        });
      });
    }

    function autosaveTheme() {
      localStorage.setItem('vscode-theme-last', JSON.stringify(makeThemeObject()));
    }

    function randomColor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    // Event Listeners
    buttons.save.addEventListener('click', () => {
      const theme = makeThemeObject();
      let list = getSavedThemes();
      list.unshift(theme);
      setSavedThemes(list);
      renderSavedThemes();
      alert(`Theme "${theme.name}" saved!`);
    });

    buttons.export.addEventListener('click', () => {
      const payload = makeThemeObject();
      const output = {
        name: payload.name,
        type: 'dark',
        colors: {
          'editor.background': payload.editorBackground,
          'editor.foreground': payload.editorForeground,
          'editor.selectionBackground': payload.selection,
          'sideBar.background': payload.sidebarBackground,
          'sideBar.foreground': payload.sidebarForeground,
        },
        tokenColors: [
          { scope: ['keyword'], settings: { foreground: payload.keyword, fontStyle: 'bold' } },
          { scope: ['string'], settings: { foreground: payload.string } },
          { scope: ['entity.name.function'], settings: { foreground: payload.function } },
          { scope: ['comment'], settings: { foreground: payload.comment, fontStyle: 'italic' } },
        ]
      };

      const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${payload.name.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    buttons.random.addEventListener('click', () => {
      controls.editorBackground.value = randomColor();
      controls.editorForeground.value = randomColor();
      controls.keywordColor.value = randomColor();
      controls.stringColor.value = randomColor();
      controls.functionColor.value = randomColor();
      controls.commentColor.value = randomColor();
      controls.sidebarBackground.value = randomColor();
      controls.sidebarForeground.value = randomColor();
      controls.selectionColor.value = randomColor();
      applyAllColors();
    });

    buttons.reset.addEventListener('click', () => {
      applyTheme({
        name: 'Default',
        editorBackground: '#1e1e1e',
        editorForeground: '#d4d4d4',
        keyword: '#c586c0',
        string: '#ce9178',
        function: '#dcdcaa',
        comment: '#6a9955',
        sidebarBackground: '#252526',
        sidebarForeground: '#cccccc',
        selection: '#264f78',
      });
    });

    buttons.import.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const obj = JSON.parse(ev.target.result);
          const theme = {
            name: obj.name || `Imported-${Date.now()}`,
            editorBackground: (obj.colors?.['editor.background']) || '#1e1e1e',
            editorForeground: (obj.colors?.['editor.foreground']) || '#d4d4d4',
            sidebarBackground: (obj.colors?.['sideBar.background']) || '#252526',
            sidebarForeground: (obj.colors?.['sideBar.foreground']) || '#cccccc',
            selection: (obj.colors?.['editor.selectionBackground']) || '#264f78',
            keyword: (obj.tokenColors?.find(t => t.scope?.includes('keyword'))?.settings?.foreground) || '#c586c0',
            string: (obj.tokenColors?.find(t => t.scope?.includes('string'))?.settings?.foreground) || '#ce9178',
            function: (obj.tokenColors?.find(t => t.scope?.includes('function'))?.settings?.foreground) || '#dcdcaa',
            comment: (obj.tokenColors?.find(t => t.scope?.includes('comment'))?.settings?.foreground) || '#6a9955',
          };
          applyTheme(theme);
          alert('Theme imported successfully!');
        } catch {
          alert('Failed to import: Invalid JSON file');
        }
      };
      reader.readAsText(file);
    });

    buttons.copyJson.addEventListener('click', () => {
      const text = previews.json.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const btn = buttons.copyJson;
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
        setTimeout(() => btn.innerHTML = oldText, 2000);
      }).catch(() => {
        alert('Failed to copy. Please try manually selecting the JSON.');
      });
    });

    // Tab switching
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-tab') + '-tab').classList.remove('hidden');
      });
    });

    // Color input listeners
    Object.values(controls).forEach(input => {
      if (input && (input.type === 'color' || input.type === 'text')) {
        input.addEventListener('input', applyAllColors);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        buttons.save.click();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        buttons.export.click();
      }
    });

    // Initialize app
    (function init() {
      const saved = localStorage.getItem('vscode-theme-last');
      if (saved) {
        try {
          applyTheme(JSON.parse(saved));
        } catch (err) {
          console.error('Failed to load saved theme:', err);
          applyAllColors();
        }
      } else {
        applyAllColors();
      }
      renderSavedThemes();
    })();