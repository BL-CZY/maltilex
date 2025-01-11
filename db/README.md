# My Maltese dictionary's database

## 1. DB Structure

1. Imagine the DB as a google drive folder, and there are two folders: Words and Tokens.

2. Words contain all the documents that contain information about a word. All documents must have a unique name.

3. Tokens contain all the documents that contain information about a token and a name of a document for word, which is the ObjectID of the document.

4. There are some helper programs available to in the repo

## 2. Document Structure

### 2.1 Document Structure

When talking about paths, I will use $projectRoot to represent the path to the repo.

There will be a words and a tokens folder, which would be refered to ```$projectRoot/words/``` and ```$projectRoot/tokens/``` below.

#### 2.2 Common:
Every word document must contain these information:

**\*The sequence of attributes doesn't matter, but the names of the keys do**
```JSON
{
    "word": "n-krt",

    "surf": "karta",  
    "surfPhon": "/idk/",    
    "pos": "n",
    "root": "k-r-t",

    "en": ["paper"],
    "en-extra": [],
    "mt-extra": [],
    "examples": [],
    "contributors": [],
    
    "...": "..."
}
```

word: unique document name<br />
surf: the basic form<br />
surfPhon: phonetic, Phon will be used for phonetic hereafter<br />
pos: part of speach<br />
root: just root<br />
en: english meanings<br />
en-extra: extra english tokens<br />
mt-extra: extra maltese tokens<br />
examples: examples<br />


The unique name could be anything, but I do recommend the **Part of Speach + Root** format. If there are two keys that are unique, add a tailing index like ```n-krt1, n-krt2, etc```. The algorithm is able to find that ~~in theory~~.

#### 2.3 Noun:
Nouns have some other atributes <br />
There could be an arbitrary amount of them under ```forms```

\*```"...": "...",``` *means the common part described above*
```JSON
{
    "...": "...",
    
    "forms": [
        { 
            "form": "sg",
            "word": "a",
            "gen": "m",
            "phon": "/WIP/",
            "en": "foo"
        },
        { 
            "form": "pl",
            "word": "b",
            "gen": "mf",
            "phon": "/WIP/",
            "en": "foo"
        } 
    ]
}
```
gen: gender <br />
sg: singular <br />
bipl: plural for 2 specifically <br />
pl: plural <br />
en: english meaning <br />

#### 2.4 Verbs:
verbs have more properties per form:

```JSON
{
    "...": "...",
    "forms": [
        {
            "word": "word",
            "phon": "phonetic",
            "tense": "perf/impf/imp",
            "pol": "pos/neg",
            "sub": {
                "person": "p1/p2/p3",
                "number": "sg/pl",
                "gender": "m/f/mf",
            },
            "ind_obj": {
                "person": "p1/p2/p3",
                "number": "sg/pl",
                "gender": "m/f/mf",
            },
            "dir_obj": {
                "person": "p1/p2/p3",
                "number": "sg/pl",
                "gender": "m/f/mf",
            },
            "en": "foo"
        },
        
        "...", "..."
    ]
}
```
</details>

the names of keys are formated like this:

1. tense (perf/imperf/imp)
2. subject (p1sg, p2sg, p3sgf, p3fgm, p1pl, p2pl, p3pl)
3. direct object (same as subjects + n if none)
4. indirect object (same as subjects + n if none)
5. polarity (neg/pos)

#### 2.4 Adjectives/Adverbs
Basically sams as noun, allowed form attributes are: ```cmp (comparative)```, ```spr (superlative)```, ```m```, ```f```, and ```mf``` <br />
Again, there could be an arbitrary amount of them.
```JSON
{
    "...": "...",

    "forms": [
        {
            "form": "cmp",
            "word": "isbaħ",
            "gen": "mf",
            "phon": "/WIP/",
            "en": "foo"
        }
    ],
}
```

#### 2.5 Extra
There are some other part of speaches, so this is here for them. Only one attribute is needed:

```JSON
{
    "...": "...",

    "forms": [
        {
            "form": "moon-consonents",
            "word": "il",
            "phon": "/idk/",
            "en": "foo",
            "extra": "before moon consonents"
        }
    ]
}

```

This attribute is a list of JSONs that contain information, and there is an **extra** section that can be used for extra information.

## 3. How to contribute

1. Clone this repo
2. Add some documents to the words folder
3. Add yourself to the contributor list in the documents created as well
4. Open a pull request with your preferred citation format
