# Translation Examples

Practical examples of how to translate database content in your components.

## Basic Usage

### Example 1: Translate Bonus Title

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';

function BonusCard({ bonus }: { bonus: any }) {
  const { t } = useTranslateDb();
  
  return (
    <div>
      <h2>{t(bonus.title)}</h2>
    </div>
  );
}
```

### Example 2: Translate Entire Bonus

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';

function BonusCard({ bonus }: { bonus: any }) {
  const { translateBonus } = useTranslateDb();
  const translated = translateBonus(bonus);
  
  return (
    <div>
      <h2>{translated.title}</h2>
      <p>{translated.description?.content}</p>
      <p>{translated.bonusInstructions}</p>
    </div>
  );
}
```

### Example 3: Translate Casino Features

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';

function CasinoFeatures({ casino }: { casino: any }) {
  const { translateCasino } = useTranslateDb();
  const translated = translateCasino(casino);
  
  return (
    <div>
      <h3>{translated.name}</h3>
      <ul>
        {translated.features?.map((feature, i) => (
          <li key={i}>{feature.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Advanced Usage

### Example 4: Translate Array of Bonuses

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';

function BonusesList({ bonuses }: { bonuses: any[] }) {
  const { translateBonus } = useTranslateDb();
  
  return (
    <div>
      {bonuses.map(bonus => {
        const translated = translateBonus(bonus);
        return (
          <BonusCard key={bonus._id} bonus={translated} />
        );
      })}
    </div>
  );
}
```

### Example 5: Translate Guide Content

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';

function GuidePage({ guide }: { guide: any }) {
  const { translateGuide } = useTranslateDb();
  const translated = translateGuide(guide);
  
  return (
    <article>
      <h1>{translated.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: translated.content }} />
    </article>
  );
}
```

### Example 6: Translate Custom Fields

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';

function CustomContent({ item }: { item: any }) {
  const { translateObject } = useTranslateDb();
  
  // Translate only specific fields
  const translated = translateObject(item, ['title', 'description', 'content']);
  
  return (
    <div>
      <h2>{translated.title}</h2>
      <p>{translated.description}</p>
    </div>
  );
}
```

## Real-World Component Examples

### Example 7: Casino Bonus Card with Translations

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';
import { useI18n } from '@/context/i18n.context';

export function CasinoBonusCard({ bonus }: { bonus: any }) {
  const { translateBonus, t } = useTranslateDb();
  const { t: tCommon } = useI18n();
  const translated = translateBonus(bonus);
  
  return (
    <div className="bonus-card">
      <h3>{translated.title}</h3>
      <p>{translated.description?.content}</p>
      
      {translated.bonusInstructions && (
        <div>
          <h4>{tCommon('bonuses.instructions')}</h4>
          <p>{translated.bonusInstructions}</p>
        </div>
      )}
      
      <button>{tCommon('bonuses.getBonus')}</button>
    </div>
  );
}
```

### Example 8: Casino Review Page with Translations

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';
import { useI18n } from '@/context/i18n.context';

export function CasinoReviewPage({ casino }: { casino: any }) {
  const { translateCasino } = useTranslateDb();
  const { t } = useI18n();
  const translated = translateCasino(casino);
  
  return (
    <div>
      <h1>{translated.name}</h1>
      
      <section>
        <h2>{t('casinos.features')}</h2>
        <ul>
          {translated.features?.map((feature, i) => (
            <li key={i}>{feature.text}</li>
          ))}
        </ul>
      </section>
      
      <section>
        <h2>{t('casinos.advantages')}</h2>
        <ul>
          {translated.advantages?.map((advantage, i) => (
            <li key={i}>{advantage}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

## Combining UI and Database Translations

### Example 9: Complete Page with Both Types

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';
import { useI18n } from '@/context/i18n.context';

export function BonusesPage() {
  const { translateBonus } = useTranslateDb();
  const { t } = useI18n(); // For UI translations
  const { data: bonuses = [] } = useGetAllBonusesQuery();
  
  return (
    <div>
      <h1>{t('bonuses.title')}</h1> {/* UI translation */}
      
      {bonuses.map(bonus => {
        const translated = translateBonus(bonus); // DB translation
        return (
          <div key={bonus._id}>
            <h2>{translated.title}</h2> {/* DB translation */}
            <button>{t('bonuses.getBonus')}</button> {/* UI translation */}
          </div>
        );
      })}
    </div>
  );
}
```

## Migration Example

### Example 10: Handling Old and New Data Formats

```tsx
import { useTranslateDb } from '@/hooks/use-translate-db';

function BonusCard({ bonus }: { bonus: any }) {
  const { t } = useTranslateDb();
  
  // This works with both formats:
  // Old: { title: "Welcome Bonus" }
  // New: { title: { en: "Welcome Bonus", es: "Bono de Bienvenida" } }
  const title = t(bonus.title);
  
  return <h2>{title}</h2>;
}
```

## Tips

1. **Use `useTranslateDb()` for database content** - It automatically uses the current language
2. **Use `useI18n()` for UI text** - For buttons, labels, etc.
3. **Translate entire objects** - Use `translateBonus()`, `translateCasino()`, etc. for better performance
4. **Combine both** - Use UI translations for static text, DB translations for dynamic content
5. **Test with different languages** - Switch languages and verify translations work

