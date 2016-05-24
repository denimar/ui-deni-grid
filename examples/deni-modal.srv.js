angular.module('app.scripts.deni-modal.mdl', [])
	.service('deniModalSrv', ['$q', '$compile', '$sce', '$templateRequest', function($q, $compile, $sce, $templateRequest ) {

		var me = this;

		//Privates Variables
		var _PADDING = '3px';
		var _FONT_COLOR = '#00688B';
		var _defaultWidth = '450px';
		var _defaultHeight = '250px';		
		var _TitleBarHeight = '20px';
		var _buttonsBarHeight = '30px';
		var _OUTTER_BORDER_COLOR = 'silver';
		var _INNER_BORDER_COLOR = 'silver';		
		var _TEMPLATE_DIALOGS = '<table>' +
			                    '  <tr>' +
			                    '    <td style="padding: 8px; text-align: center; width: 64px">' +
			                    '      <img src="{0}" />' +
			                    '    </td>' +
			                    '    <td>' +
			                    '      <div style="max-height: 80px; overflow-y: auto;">' +
			                    '        {1}' +		                    
			                    '      </div>'	
			                    '    </td>' +
			                    '  </tr>' +		                    
			                    '</table>';	                    
		var _TEMPLATE_DIALOG_DESCRIPTION_MORE_IMAGE = '<form style="padding:20px;">' +
		                                              '  <label style="font-weight:normal; width: 90px; vertical-align: top; text-align:right;" for="edtDescription">Description</label>' +
		                                              '  <input style="width:350px;" type="text" name="edtDescription" placeHolder="type the image description"><br>' +
		                                              '  <label style="font-weight:normal; width: 90px; vertical-align:top; text-align:right;" for="imgImage">Image</label>' +
		                                              '  <image style="width:150px; height:150px; border:solid 1px silver; margin-top: 3px;" />' +
		                                              '  <input type="file" style="float:right; margin-top:3px;" accept="image/*">' +
		                                              '</form>';			                    

		/**
		 *
		 */	                    
		me.ICON_DIALOG_CONFIRM = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAC6tJREFUeNrsWglwE+cVfqvLsiQforbMbQzmsDnLTNtcpSHTcpQ0AyWlzFDOUtoSEo4AhdBwTAoTU8INCTQZKDAUMIQAZYY0pAkDaQOkTIJxjG1sY4y5bGzZsmRJu9rte//+K61sy9hJ2gwz/J7HaqXd/3/H9773/l0ERVHgYR4GeMiHSfsgCEK7btxx6D0INYmeGBQH4SzZoZCUTDMajcahoVBQEMXQXfy5kq4JBoJfeupq83OWLa5ev2sfA4Asy6BHQkgKgSSKEBQDIIeif9PGmj/MjzagvQOnxYVDTwiCYRQu8ITBYPiBs0OSwx5nA4PJAHgOyQkOkEIhaGz0QyAosvs8Hg94kpMBlS8WJekz0R/8qKK89PiOda9X5ezcLTNnIi5MZjMYjAY0JAjoADSiZUME7cu2RICu3Zl7LFVWlCl4OsuZ7OyTmtIBnElJkJiQAAIahd5nXsMJyUBQZFmdHw1iayhsMfD4vOCurYfqmmqoqLwlSkHxmM/r/evqxfNOURBWb/uLQtfTmpIkYnSlKCO0CLTZAISMAxVfYRCEl3qkp1u6dekMVosZJ0YP4QIh9LQk4SJ41IxlkcJFaW76C6/DxAAm9DAZRtfeqaqCm5W34O7dqoLqqnsLNqxcdpoMeW3LDoU5QlHYGhqk2mXA9gPvTsL13+id0TMtMyOdYdbvb4RAIAAiSgjPQzgx+pzNYxBUb+unpGVoLTJIllkYEGYkRgYVs8XCrrt95x7cqLwJd+/cPXKt8OqSfW9tLVu1cVtI4ZNIkswigZF6sAFvHjpqwZDvRG9P7dalEyTYHeDD0Pt8pLyfJRtihOHdSGJUsU8GkHL6OZnysmaAajAZzhKYG2MymVGMGBUjlJSVQdG1Enfl9fIJOzfkfIxTSCs3bFXoHgXn+dOiua3T6PaDRx244Ac909OnDszuB1azBdzuWhQ3NGAiisEAqYUwMILZZAKzGQUVsGDyWSz8iBKn+6x9T9ep15vY/WQn5Y7f72cSQiimd+sK/fv1Te7ao8fx2UtenYyLWVbOnyPo4RnTgG1/O5KEnjnXOyNjWJ/MDPDU10NtbQ07+hsbWQjJy6rXjUwJk5EUUo2xkJjNzcWkKk3X0fV0H91v5FEjh4hIn41oBNFop45pMHTIIGv/AQPe+d2ipTPwgrjXXn5JeCALbd1/+GjfzF5jM3v2AG9DA9Sj4kG/inUaUYqbmhxRTp48CRcvXoDyGxWqYjh1/+xsyMrKgtGjRzNqZSJFHylJ9WtQbpBe92vccOE/l8SSoqvjDr6zg5I7CCqfNa8Dm/cemonhQ+XTUXlPWHlkIJU8KEmNAhogMMwTk5iY541Qc78GcnJyGMzirPGQ7OzAfiMLbt25CxU3KyHvSh7MmD4DnB2cWnYwSCig5gITnuxYKUHA+Z3ORBjUP8uMdLq9W6/ewypKim9R3WwGoc17Dzrw/jVdO3cCn9cHXm8jKh8ERhqMBikxKdxGJsxLBjoaIYBGrl27FjwYsUQsVCQOrA02THyb3c6Ezmvd9bB33z4OORO/PzKnwKCkrsXWJfZCQ1ypqZDZM6P7yOd+/nv8Nl7TPSoCmLS/7d2rR6rDZmOJGkSmYVbq4GVEtlBFzQEWAYTN6TNnoK6uDhKwqNlsdpj4/Hj46cifMJaRkHF27dkH5z79FBPZAvdr3fDZxYvw2GOPM9gosgFkg8ILFRU7HXuhFQLRLQaEak+pyzULjKY3MdOJRQKGaAOkyV06uZAi0fNBP6ukDMJcCDoqd6swUs8NDE7l5eVgjbeBFY2f+Ivx8OzokQx2hDuC2oypv4K01BSGcWoTPF4vWOPMKu2G54rMrV+X1z10TDykuVKc4ydNGUGsRGEKR+DPb+9JwskG27CXIa6XRClcPcMZr/2xYqUWLIOgns+fNxfs8VasznEsIuRZI28fWBXF+4nBqC0wMyrlEArPE6nYTdclGGnffQfzytWx4zD8+B5KYzgC2It8NxFxSgtQS0ChF7hyUWIQWv4e/4hNAthaBEQxzGyaEQdyD2Nxus5cSe3DgOwsSt+2z88lMcGOUbb3IUolRIcjgDTmMqJHQgr2GyjQUmchRI6KxmM6Nyn6fxVVCDLrNm6C909/CI7ERLBYrfCjp56E7H59odpdpzkYlCbzxxrUcqBTkuhjlAEJdpvsIIwhvYkOOxYUiSmjUlpEIdbDaBDi7QOrCQY1mYlVtJpC9y1eugzyC65CUrKTMdLj3/8eTJk4AbzYYtP1VoSdmfM/tRraOhpMNc8beBMYcAbgc6dT5iwUyQFJClb6fD6oQ/pkHSaHQbMtnNb3kMLcW7SATEILK9TjCGzHkIuwyS8oQGZSKfXZkSNg3M/GYKUNMJjJrD9SFdd6I60/ijXu19RQq1HbbEdWXlKSZzZbglJQsuiTpvkGIoId1Vu6Ri2ciDKjwiPHjoMNFbcnJsCEcWNh1DPDwUfKo4Mi3tb1Noo6v9AKhurqG7ClqcunVpu8FE7iLTmrvej1T6rvV3Ovtizq3Fr1VLlbhRjvMmW1Jai8fRu3hCIrYLjxgRHDn2awCYhBvoWM3KdBldNNzLVJKALlJdfO8kos6+uAgjui3Tew3MuoQCwWiN6hcZHVCNAeWQ4pYSgQKVDSORwOpjQZxH7nEVNkJTxHVJRjrF2LSV9VXV1+aM+uS8TKhPyoSnwi98Ch5ydPW5bmSu3TKc0Vmwo0FlIiSS6ou3P+mwApKSmwa8dbrCGLw/Y5iKSgJarMva8nB42FWoMPbj2hpKhwB1c+0DQCcPFf5wJ17tq5n+flh4iFtJ6kqVC51zwnc2+quzL1SK0DNW+Tfz0TfvPCi7Bw+Qrw46Ze0hKVX6caE4kCayNirFlSVg4lpWXn3960/gR+0cANUJruB5Q1Sxd9iFDaXFRS2ioWVcZXIttELhEmCbGWgVoLO9In9Uzh33TXa7nE4hZjLcqnLwuLqv5++OByrjyJFGtDIy2fP+eVouJrR/KvFrGEbC0fNFIKR4MnM3nXhDkQj42dHXOANjNyWHnudV0xjLVGGe4pEBH158+eefnCJ2fLiIg4hJTW9sRkWPyKdRvXZmdlzabtXXJSYmsp0cwwOlCbTcWRlPdhZ9vg8+voV4f9GINQgEXw5vvHjs75+B+nCqgMoNSv27lLXDhreqt7YqokjasWzlt86dKlBWf/fV4sK78ROxLUsHGXyOHEZu0JuD0NcA/bZw8qH67qYfe1PJ+nwQtXsHpfzsvPy92zexoqT7xfTc/FNOi09cEWGWidOH3m4AFDhq5J797taRTWFrdlCFooHuDp8CNFTPLi0lIoLC6pr7heun3L66v3c6XdhHv0fFh5LQJteS4k8N7b/sLiV8Z2TU9f4kp19e7etTN0wZ0b9TPfxCgoLCbIBNw1NSfe3b9nS0He5TtceZJGVD6kv749BoQ3YxQNMmTa7Bd/2D2j5y8TEpPGYM2wOZOToANuIZ3OZNbjt3d4sQc79cE/b+7c+Mak0uLCKq40MY2PKi4q3yyAmgHtWS3EJwzu3r6Fnl+eyRo4OPWpZ378ZIeUlCHYrA3BjfxgZB5HYoKD3UCPUqzYPtd7POyctoQZ6d2jtqg06Akf7kGqufIa1sWmXm/18Xobh8J7EMJioCDviwYUemx+jMPMkuJy2YaPGpOlyLKAEUrCPUBa5Y3yaxhhJWvgoOcavL5J/fpkQhx/lNhkA0CPS3youL/d7wfaawhPKAlDGeCRIYgZq+/dM+Tu2XWTnwta386Z7aNX164nD8/N0hkhRDuoXa+MTF83+Tg+JT29oVFNewFNOeG1xQuWrVi3iXYM87P69mZGtPflyjdqQCtGtehJNE5etXDuH9EIMo0ZAV9d////OzI0jqDkJyO+uHxlA9Hn17HgW3nJ19SIisrKh+8tZVMjBAM9ewP5oXrNqjfiftW9Dfous62jXS/5/sfvqy2ceoPak+e2EXr4ec+3PvQ1o/0RePRfDR4Z8MiAh3P8V4ABAFZiphiXo1ppAAAAAElFTkSuQmCC';                    
		me.ICON_DIALOG_INFO = 'data:image/png;base64,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';
		me.ICON_DIALOG_WARNING = 'data:image/png;base64,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';
		me.ICON_DIALOG_ERROR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFNklEQVR42u2YbWyTVRSAzz3turGgmYngBybqD7cwDGsLG7IhY/wANSI6205dppCJbCSoMRrQhW3IEKIhQYmTRZxhKG7tzCJgnPxQh3xvvK1fIMQPjAbFaBbZHPvqPZ62OtK1696+b7t2iefPbu9777n3Offcc8+ZgEkuItEbSEoAaTNPI8R6bt7n+41EH0DK8Gqx96vuSQHgtVn3IcKyICiQbQanpzjpAWSJdYkg+DjcNwJYjE7l06QFoMJCo5ze40EBs8LCAXhwpjJHbPQ1kxBA2qyVAqE+IiTAKj6FXUkHQMtzMmSq4RwCTIsIKemiSE3JxHdPXkoqAK/Duo03/4yasRJoq8Hpfj5pAGSx+TYy4tcMYFI1Xsp+NNBM0fLF+aQA8NosbYji/qgmEbmEy+1IOIB0WItYySda5pKAhdiifJ4wALLbDRK+VzhsztYET9CF2co8PWFVJ4D1CdbQEPIhfSoHyyqAvKLA764OgIZNAH29oToIVqBL2T3hALI072oaGDrHvn9dyMentgDkLwnuO9IO8FpVqB4JF1D0ZwnX6V7QIJoByGHdyn/Whf34zjGAlFEBabAfoKwgvDEI6gwuZcOEAUjb7FsJjWc4bKaGHdByKvzEh/N4sjdUH8jLQhizsKXr5wkB4GyzlbPNB8cc0MC5XMa1wX0+/19ZOLZRAN4zOJVH4g7A2eadnG0eijjoxUaArJzgvh+/BVhfGgmAhKQCbHUfixsA1QDKb8ydiGiNOHDtZoAFdwX3neSnYttzkY1D8gS6PPOFP+eLA4B0WFYKEI3jDiypBCh+PLhv/x6+3NvHN5KEUmxV9sYcgOzZU6UwcbaJN4w7eDFnFatHBZW3OGgddI1vJIBfsE9kiQOn+mIKwNlmHUedKlWDZ80FqB71vm1Zy+XMUXXGAqjlmmFjzABkseVmMhKHTZyiagfTZwDs2Bfc9zSXw7/+pGo6P25/CyNlYrP7QkwA2PrNbP0SVav7BA3s72xtg3FkR1CWDzA8pFoFP25N/Lg9phtA2izzCcURjDbk7tjPJ3FjoP3nRYA190Q13R9WQc5Dp6dTMwD7ouDIcxxB5EW1uk827AS4PTfQPqOwV6+KWgW/0IcZYGGksBoRgK1fJlA0Rb2yTyqqAYqWB9odBwDqazSp4Wy1hLNVZ9QAdO+cdJlOZ9l1btK08gPlAA+tCbSdfBrvv6lJDV+f8wJM2dh6/HJUAFxp1fDHWk2r+mTB3fwi1wXar/NpHPpQsyo+hSo+hZdUA0hbzgy+uL5HK13zqplcpG16O9Cu5tM469GsSgL1IBkzhavzN1UAHDab2HXKNK/ok2s4G935738YK5YCdP+hSx1HpUbOVsvHBZAOcy4Bnog6bMZZ+C5IYcS52NzlHhPAHzbt1sNcpOfrWs2UBlC+/kpZefRgIBfyVWX6pEM4lUVjAvDmHUJAi25zVdYCLFoW3PcZP2xv1OpWzdlqMWerbSEA0nbHFILB01xp3aJ7lT2cRphGVZuDAwCPFvhDih5hT/pBXOrNxvbvBoIB7NYX2PqbdW8+EkCZPs/8TwhoHTrdL48AkD33eimGOWyKq2KyQhxdKCDyLxqSmdj25e9+AA6buzjqlOtVOyLxu8RXEAgaOFut4GTNnEMSFfZ9jJn2CRC+C14h0SK8NnM7F+lLE70hTRAEHwmvwzyM/gpk8on/FNj/u9l3MhK9GW0A1MMAllc4+jyb6M1oAiC5XZA92yRF2qucbKzgu5CW6E2p2riU/SBwN0L/k0mVsGmR/wESLf8AUDTOtcRWYicAAAAASUVORK5CYII=';		
		me.ICON_DIALOG_CHECK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAC4jAAAuIwF4pT92AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAWXElEQVR42oyNsQoCMRBEZ0OOoAcq6QQLe7l/ua9XEFu1EQvlOBKTHfdsBCunmWIebyT2c/zGBQdNivJQtF1AvlS4ViACaJl2gNZUQgdKWPvFcMhxtm02ddSdkSvy6zNO06kcCV59dOf65M0vJUkjrPbxuivGfTYxIIpPT/5/8hZALAzkA6B3GEzZ5FiimHmYjHjN2aUYWRiFWZmYuSBOQAJAz3Cqs/76//f/N4a/DK/+fvl359+3/+d+v/q7CSh7GYj/kOsIgABiJCMG2Ji5GfVYJVkqmFgYPP79+s/N8A/iHUYw8R/qZkYUn0LEgPDvf7A6Rg6w6u8/H/1Z+fXyr55vF3/eA5r1ndQYAAggFhJD3JJNmjmXiY3RCehOsd/f/jAwMTExSItLM0iKSzEI8AoysLGygTEjI8ID/4GKf//6zfDr90+Gj58/Mjx98YThxZsXDD9//eRkk2KNZxHj9OHUZN3148bvhq/nft79/+f/P2IdBRBARMUAMKoFmPiY0jhkWOr+/fzP/Z/pPwMbCxuDuqIGg5aqDgMLKwvD3z9/GP4DEz4zIxMDMwMLELKCffwP6Pg/wOAEYWCOAcciMwsrw79/fxnuPbjLcOX2ZYavP76C1TKxMX37cuZH08c932f9/fL/I0g7IQ8ABBBhD+ix8wHT+GxGFobQv3/+Mf7794/BysiGQV5agYGJGexCBnFmKQZJVkkGAUZhBk5gFmD7z8bAAtQADHqGP4xAxzP8Yvj57wfDt3/fGN7/f8fw7M9jhg//3kPiFOjEtx/eMBw7e5Th249vDEwsTL+AAXbgzfLPaX/e/XsKVPEXkouwA4AAYubUYMX0FQsjKK0yAiNSjVODbQMw1FyB7mYU5BNk8HMKYBAXEQWrk2CWZNDlMGSQY1Fi4GPkZ+Bi4mLgAEJWRqAH/jODkxcoN/8HeoQJGDOsjKwM3EzcYA+LMIsw/P73m+Hn/x8M3JzcDMpyKgyPnj9k+PXzFzMwvylzKLOZfL/z+9D/H/8/4YsJgADC6QGgzcqc2mxLgSyzf//+MxppGjGY65szsAOTjhCjCIMsizyDCJMYAxsDOzC0gYkG6DgQG+R4sAeAMQBxPiM8B/0DJ6J/wCD9DYwcJgZeJj4GPiZ+sLpfjL8YVBXVGLg4uRgePXvMwMLLJMetw+7+68mfi38/gmMCqycAAgi7B1gZuXiM2Fcw/mO0AfF1gOncEOgBUMoWZ5UChjQP0KkcYEeyMAEzLcjRTFCHg2iQSiYWSMQDo+8/uGQCOh9YxACrBDAfBP+CSk+gFEgvBzMnw8e/7xkkhCQY+AUEGO4+vMfAwsYszCbFrPLtyq9dQMXfsHkCIICYuTQhJQYcMzNys8mwTAS6LggU8toqOgwG6gbAyoiRgQcYYsCEAc6goBAHJQmQJ0AOZwZBRpAsMzhEmYDJBhTif///BdJ/wA6HhD6Q//8vmP4Lo6HyrMysDEzfWRmMGM0YvvB+ZHj84hEDKz+zJMhZvx78PQs07jt6fgAIIKAH2KHRDMFM3ExBQF83AfMAs4G6IYO5jgXDn79/wI5lBToWVMJA2JBkwgr1DAsjE9jxoFIIaArImeBQ/gfMxJCkA3EqiPUHGhN/wXIg54NKqd8Mgs/EGdzEvRkEeQQZXnI+ZeDk4GR4+OwRM7cWu8Xfz/++/Xry9xzQkT+RPQAQQEyg5gAMM7IzKnCqsfb/+/OfhY+bj0EHGPoff38EOuIfuIICQRANc9A/uLOAjvgPchgodf9h+P3/J9hBf4DpGhIDfyHJCBoLsOQErtqARTKwAmNQ+6bDEGgTzKCuo8bw7P1zsD59YMwryykzAGttRn47zhQWQSZDoCYOZA8ABBCyBxhZJZnSgIZJ/vrzm8HFwpXhL9NvSPn9HxJi4FD7j54EIKH3B+T0f7+Ajv/F8AvIB5JA9m8gBssA5f4w/IV5G5QPgMUayNxfn/8wKL5XZ7A1tmcQEBQA19KP3j5iYAaWYD9//mTQU9YD1y9MPIxSnLpskUA38yNV7gwAAcQErtKBmImXURrYRAgEhbIFMNnw8Qow/Pj3kwGUICBZEAH/gBwOLt8hHgQ7FORgEP4HcvpPiEeA+oEFJcPffxAPguBfoHoQ/sP4m+HfZ0YGM35rBgcnBwYuLk6wg/7++QvMzG8ZGJmYwIEjLCDCICepwPDn519GPnvOcGYBJhOgMm6YBwACiOnnA6AVQAz0ggMjK5MyCzMLg6a8FsOHX2+h2eU/pNT4D03HsFD/C0m7IMf/ASaZX/9/MkC8AXQ+mA+LAWhsMPwB6wPrAnr+54dfDIYCZgy62joMbGyIkvDf338M3xiBFRoTJJBBHrc1sIM4lpWRn9uAPQTIFIY1GAECiAlYyzIAsSCHEksp0PesMmKyDP/ZYGkVaOD//+DoBicfWIYDGwtz9E+gg3+DQ/sHsLYFVUwgcSAPDEE0xAM/wB4Dy3/6w6AraMygrqWG0mYCxwAwYP4x/4UGGLANBUx6PBw8DNpKOgz/fv9l4FBjsWDiYFQGKgWVPgwAAcT069k/YPpisgPWfrp/gaWNiYYp2CGgEoURmtTA3mGEhD4s2fwC4X+Q0AbD/6DmwncI/v8d7FAwhnrqBxD/BtEffjCYCFsw6GnrMjAzM2HWQUAPcQA7HH+hAQhK0p9/fWLQkNcGxgoLA5sEiyKrMDMoGfGClAMEEBOowmSXYPH49/0/oyCvMIMAsBJBbQRDDAHFBKxEAbVtwLEATMe/wJkWEuLAOAE6FNLu+fkXGNL/foBj5tffn+Bmww9gi1RbwIBBTUMV6Hhm7M1jFhZg7SwItgtWuINikJ+Hh4EVKAdMRmxsCizGQGGQQxkBAoiJ24CNi0WESRWUTGREpMEWM/1nAmde1D7JX2gG/gPFv8HRC44JcJr/AcFgj0CTECx2gOyvQMj9kY9BU1kLI9mgFIssTAxSzNLAjP8X3q8ApQVg0wpcPwDzHiOHKguoOBUC+RcggFj+vP3Lxy7DIgGsicA5HlTsMYIqpf+QpAPrnvwDJ6h/4IzNyPgH7ikGaOZm/gdqPvwBNuJYwA03UBKEJAmgOcBimv+DMIOjngsDNw8XVoeD0vyPH8Bk9vs3sK0lyvD/K1AjD6STxAgMUJBbpISlGZ69ecrAJskiycTOKAts2l8BCCCgB/7zAm3hYwTmem5uXnBrA9Qk+AfuXDFC2y5I8cAIChNIG+Y/tIRi+c8KKeGBjgeVMMz/mcG1MSM09P59Y2awU3NiEBETwhnyb9++Zbhy5Qq4M/Tt+zeGX+9+M7DzAQMD1LkGBggosMSExIFJC9jk4GblZuZnUvr36i87QACxAM1nA0UFyI0swHQJagaDEgsoDEGKGcH9u3/Q8P4LjoU/wBD5D25dQhoMfxlBMQBqRgDbMsBOAigJgpIJyAt/fgP7D6x2DNKSklgdDmqmvHz5kuHunbsMb969YTh96xTD0ftHGfSDNMCxAo0eYCwCW69cvJDWAMh4VkZQaHACBBCoSwkvbkBWgnI1A9hh4E4u2KHAohnaHACZ9RdcLv1mBFZywGQD8v1fsJkgh/9GhP5fZrCXlb9oMlhZ2QB7YZiZ9jewxr9+9TrDu/fvGE5eOsmw9/FuBlkzCQYLW11gXmAGp39QKmCEuAyYvP/DS0YgAFnNChBAKH1iUIuSlZEZGs7/wEMF/6DdU1CIgpsUoCTzh5lB45seg8R/aYb9PNvASYgRGAvgtP8PknQYgUUk9wdeBjcNTwYOLnYMx4OaCVeuXGb4+O4Tw/4L+xku/DvNYBQODfV/jGDHg/IhEyMjNDkyo7elwYUUQACxIDdPIY1hFujgDNBB/yAVGiT7/ge3jfg/izA4sLsxmOiYATvpvxjO3TrO8J7rLTDkmcCZjZER4oGfP34xePD4M0hIimM4/hfQ8deuXWP49PELw/IDyxheSzxjUDdVBFZi4AQC7QYxwWmQmcyMmCUjCAAEEAs4nkHFPJAAlx3QJATpgEOiEFSUcPzmYjD+5cxgKm3JIKsszcDKygpM338ZHG56MKz8Ow+sD9wxB+UPoF75z2oMVrY2wH4zamX1/ft3hqvAzPrmzVuG1cdXM3zTfsegrCYLbEIA7WeE1j7/ocHLxARPPqDU8fX7Z3B+ACWEf6AWI5AHEEAs4MGm/8ACHOhQUJpkA/aOQO0XUFT+BVXpwFhQfavNYC/jyKCkpARMDhzwdMjCysxgqmvGcPT8foZHfHfBngXFIuMvZgYvJX8Gdh421Az75w/DjRs3GL58/sqw5NBiBgaLnwxikkLgdhUTOIn8A+tnYISle7Bp0H4GK8Prj++ArVSguh////z7ChoVYPgDEECg1ujnf7//fwA1qd9/+QDuHoKjDZR5nrIwGNy1ZPBV92fQ1NJk4AS2GBnRopFPhJfBktsO3rj7wfSLQeKvNIOytDKKOtBoxuNHj8HF5cID8xm+AENeQJIHWED8A9cToGEWUKCBC57/DHB7IGHPDOa9ePcM2F8HZuaXfz4AWw7A1ibDD4AAYvr1+Penv5/+PQT5+tHrh8CqnA3sy2/vfjLc2fWEgZ2Vi+E90OeXLl1iePHyOaJog7fHmRhMVc0Y9D+bMHxn/Mrw6dNHBh+xIAYubi6UBtrt27cZ7t69y7Dy1HKGT4avGcRUBIFNjN+Q5gnjX3C9wwA1m5EBFgOQ5AOuj4DN7DcfX4FKs/8/rv+6D/TkG5AHAAKI6fezf79+Pv57nBnYJ7j/6j4wmn+DQ4CHn52BXYuRoW5RDUPfwn6Gd++Anrh4meHc+XPgGhMZCIoKMvjLhTGwfeVk8GIJYjBWN0FpLjx/9pzh9YvXDPsu72V4rvqAgVeKC1zjQ3vI4PoG3EuDBj8jdGgV5hFQgH7+/gVYaADLRaDGn/f/3gFKvwJ5ACCAmMHZHtgT5DFhj/n98zerCJ8ogwi/CCg3MgjI8DAomckzPHz7mGHn9p0MipJKDLzApu1bYLnNx88HH0IEYVAT4efT3wyumu4MAvwCcMe///Ce4fq16wz7zu9l2Mu0jUFcQxgS0PCaB5JYmEADAqCSBjowAB7hA/fBmRk4WDkZrj28wvDw1UOGP+//ffx87McBoP9PALW9BgggcO3y79O/18D2kBGbMKv6u8/vGHUV9MFp8g8QMwEzsrAKPwOPKg/DitWrgV3A3wwKEorg9AzKEzzAViLIA8zADK0goMQgJCgMHtACga9fvzBcuXyV4fbT2wyrvy1hkLYSA5oLdTx0yIUJllwYmSHjGYyQWhzUnAEN44A8A1K66fgGYDnzl+HrxV83f9z8vR8oBOrgfwEIIGbY8PffL/8fc2mxBf349YNTSUqZgYOdnQEcyaCxTZBHuP4zSBqJMlx9do3hyokrDLaGdsCi8DW4OOXl5YW04zk54I4H9S2uXr3G8PTpU4aJN7oZhKxA7SzIwAAjI6RihFRSCIeDWgGgkAc5HOx8oCfYWTgYDl06yPAYmD+BgfTn/bqvu4EZ+AjQilugyhwggGCF9P9fT/5cB7ZMr4KasSevHwdmXg7IONJ/iKWgkoKJjZFB1U2G4a3qC4bUxiSGj8AMe/XqVWBb5gVK5gaxHz56xPD21VuGaWcmM/DYsEKaH6B0zwgdGIB27v9B27xg+P8fvJHICG3HfPn2meHS/YvgAeTvN3+/+P3u3zWgYQ9B6R9kF0AAwRso4GY9sEHPo8/u//LtK2CznJVBTFgMOuLwBzxk8hfcC/vNwCPDzsCqyshwZP9RBi1RbWDN+hvcfucX4AeHJCjdP7zzkGHW6WkMT7XvMrDxsUJ7WP/B0wfgDA4tKpmgNSwzOAmxgBuDrP9Zwb0vTmDoH79xguElsPgEOuP7u/XA0P/yH5R8roLqRJC7AQIIuYX1//fLv3dZxZg1OSTYtB6+fMSgICkPLFaZ4aNnEAjxCDMfMPIU/jDMm7qIwU7DgeH7t+/gioqNjY3hzq07DGsOr2Y4KL8dXOKAPAdO6YyMsOEzCGRkgo/osUAHzcDZFsjmADr+xdvnDLvP7AQ2n1kYPu3/cfn7tV87gdoPQksgcJQDBBBGExHoiQdcuuwewADg+/T1M4OKvArc0ZBRBZhngK1S9v8MfLqcDAc2HWIwljMFjyg8e/6M4fnrFwwLPs9k4NJgBbdvGKEjDJAmNnT4kQnSQACNoYJY4HFW8AgfM7g18PHTJ4b1h9cBA5CJ4ced388+bv+2E5jyDgGNuQFyJsy9AAGE3qv+/fv136vvN3/pZOJi/PMEGAvLtiwDhywk3f5HGeQCDXCxCQMtDvzNULQgj+Hz588M3GzcDNsfbmb4owkst//8gnj2H0Q/KCb+IYa3oL1tpN43OFkBkxAzO8O6g2vBdv35/Pfz23VfdgNbC6eBKq5Akw48wwEEELae9Z/fr//d/vP232cuTXZLoKWsr9++ZlCUV4J05v9D4uEf0x8IG+g4Jh4mBlZgpXd25wVgO4iJYT3XMgZ2cRZ4iQNLLqC0DksqsFIGnGigoc/OzMHw9csXhtW7VwA9DOxbsDH+fbP0y54/r/7tBboLVPI8Qx+hBgggbB74D42JB8xcjDIcSmy6Xz59Znj44AGDgqIiZHSNARKa4FFlUOYGNgkYuZgY3rC/YDjx+jADvwkXIowYGeFJBELDHM2MkmxAldWHN+8Ydh7dCS5uGdkY/7xZ/eUUsMzfAzQFhB+AByjQAEAAMePoooJSy7ef9/9c+vfl7292aVaVPyx/uB8/eAye4ODgBnZQWCFzX3+hzQFQT41FCFhuy7OgDIBDQp4JPvQOz6yMkDkEdmBy+fPjH8PNGzcZTl44ASwumRj+fPn3+c2yL/t+3Pq9D+r4G7BiEx0ABBAznvkzUDL99Ovp30s/7v1+BExO5sBMy/P65RuGV09fgyc4uAW4GP4AkxJ4cPj/f+gUKyM4VkDJB1abgkIZEvpskHkFYBENaoaw/gWWWFfvMFy+eBFc9AJLm//fb/15/mbZ5x3AZANyOCjpXMfleBAACCBGImYymcHTYZyMFoIBPEUcKixGoBj/9es3Ax83L4O4sjgDiwCwqOX4BxnNBo9O/AH7Htw8AHZwQI0xUO+Z9T8w9IHdUYZvjAyfX31lePbwGcNvYPJjZgFNKjJ8/3zo+43PJ38e///n/1mgncegyeYnvkk+gAAixgMwT/AzsjJqswgzWQm4cMZz6bCr//3xjwnUxwcNxII67aDODo8gD8Mf1t/gwVxGaA8L1Gf+/xXYcPkALJmAXU14jEE6tH++Xvr15MuRH2eB+Q40C3MeKHoJ1FBDLi5xAYAAItYDMAAaAxcBpgZNNlFmay4jdntOdVYdFkFmAVAC//cHmBdAQxjQkQTEwCQkCEDdS6Bn///98u/n77d/P/64/efZ1ws/r/79+O8OtHa9CGp9g9qB+EIdGQAEEKkegMUGDxCLAR2tyMTJpMMmyazPJs+iwi7LIsciyiTAxAEsQ5gRHQJQigI2g3/8fvbnHTA/PQW2ux7++/z/JbBf+wTarrkPxI9BrW/ovDDRACCAyPEAsl5Qi08QiMXBY/aMDOJAhwsDkwawjQ2Wg7V2//4HDWP/ZwD2ysE9qddQDGJ/gGZSshZ8AAQQJR5ANoMZijmgyQw86IRU0/+HOhDk0G/QjPkHWin9p8RygAADAKHADBBkCOIOAAAAAElFTkSuQmCC';

		/**
		 *
		 */
		me.BUTTON = {
			YES: 1,
			NO: 2,
			OK: 3,
			CANCEL: 4,
			CLOSE: 5
		};

		/**
		 *
		 */
		me.POSITION = {
			TOP_LEFT: 1,
			TOP_CENTER: 2,
			TOP_RIGHT: 3,

			LEFT: 4,
			CENTER: 5,
			RIGHT: 6,

			BOTTOM_LEFT: 7,
			BOTTOM_CENTER: 8,
			BOTTOM_RIGHT: 9
		};

	    var _format = function() {
	        var formatted = arguments[0];
	        for (var i = 1; i < arguments.length; i++) {
	            var regexp = new RegExp('\\{' + (i - 1).toString() + '\\}', 'gi');
	            formatted = formatted.replace(regexp, arguments[i]);
	        }
	        return formatted;        
	    }		

		/**
		 *
		 */
		me.createEmptyWindow = function(config) {
			var config = config || {};
			
			///////////////////////////////////////////
			//setting default values
			///////////////////////////////////////////			
			config.modal = config.modal === undefined ? true : config.modal;			
			config.destroyOnClose = config.destroyOnClose === undefined ? true : config.destroyOnClose;
			config.width = config.width || _defaultWidth;
			config.height = config.height || _defaultHeight;
			///////////////////////////////////////////
			///////////////////////////////////////////			

			var objWindow = document.createElement('div');
			var $objWindow = $(objWindow);
			$objWindow.css({
				display: 'none',
			    width: config.width, 
			    height: config.height,
			    position: 'fixed',
			    'border': 'solid 1px ' + _OUTTER_BORDER_COLOR,
				'z-index': 2
			});

			$objWindow.keydown(function(event) {
				var key = event.which || event.keyCode;  // Use either which or keyCode, depending on browser support
				if (key == 27) {  // 27 is the ESC key
					objWindow.close('cancel');
				}
			});


			if (config.modal) {
				var background =  document.createElement('div'); 
				document.body.appendChild(background);

				var $background = $(background);
				$background.css({
					id: 'wndBackground',
				    display: 'none', /* Hidden by default */
				    position: 'fixed', /* Stay in place */
				    'z-index': 1, /* Sit on top */
				    'padding-top': '100px', /* Location of the box */
				    width: '100%', /* Full width */
				    height: '100%', /* Full height */
				    //overflow: 'auto', /* Enable scroll if needed */
				    'background-color': 'rgb(0,0,0)', /* Fallback color */
				    'background-color': 'rgba(0,0,0,0.4)', /* Black w/ opacity */
				});
				
				background.appendChild(objWindow);
			} else {
				document.body.appendChild(objWindow);				
			}

			var deferred = $q.defer();			
			objWindow.show = function() {	
				try {
					//Show the window					
					if (config.modal) {					
						$background.css('display', 'block');
					}	
					$objWindow.css('display', 'block');						

					//Position Adjust
					_setWindowPosition(me, objWindow, config.position);

					////////////////////////////////////////////////////
					//onshow event
					////////////////////////////////////////////////////			
					if ((config.listeners) && (config.listeners.onshow)) {
						config.listeners.onshow(objWindow);
					}
					////////////////////////////////////////////////////
					////////////////////////////////////////////////////			
				} catch (e) {
					deferred.reject(e);
				}	

				return deferred.promise;
			};
			objWindow.close = function(response) {
				var oncanclose = true;
				if ((response !== undefined) && (response !== 'cancel') && (response !== 'no')) {
					////////////////////////////////////////////////////
					//oncanclose event
					////////////////////////////////////////////////////
					if ((config.listeners) && (config.listeners.oncanclose)) {
						oncanclose = config.listeners.oncanclose(objWindow);
					}
					////////////////////////////////////////////////////
					////////////////////////////////////////////////////			
				}	

				if (oncanclose) {
					//Close the window					
					if (config.modal) {			
						if (config.destroyOnClose) {
							document.body.removeChild(background);
						} else {	
							$background.css('display', 'none');
						}	
					} else {
						if (config.destroyOnClose) {
							objWindow.remove();
						} else {	
							$objWindow.css('display', 'none');
						}	
					}	

					deferred.resolve(response);
				}	
			};


			return objWindow;
		}

		/**
		 *
		 */
		me.createWindow = function(config) {
			var config = config || {};

			var objWindow = me.createEmptyWindow(config);

			var $objWindow = $(objWindow);
			$objWindow.css({
			    'background-color': '#D9E5F3',
			    'border-color': _OUTTER_BORDER_COLOR,
			    'border-radius': '2px',
			    padding: _PADDING,
			    'box-shadow': '10px 10px 5px #888888',
			    color: _FONT_COLOR,			    
			});


			////////////////////////////////////////////////////
			//HEADER
			////////////////////////////////////////////////////			
			var divHeader = document.createElement('div');
			var $divHeader = $(divHeader);
			$divHeader.css({
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
			    height: _TitleBarHeight,
			    'background-color': 'rgb(206,217,231)',
			    'padding-left': '6px',
			    'padding-top': '2px',			    
			    'font-size': '11px',
			    'font-family': 'tahoma, arial, verdana, sans-serif',
			    'font-weight': 'bold',
			});
			$divHeader.html(config.title);
			objWindow.appendChild(divHeader);
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////			


			////////////////////////////////////////////////////
			//CONTENT
			////////////////////////////////////////////////////			
			var divContent = document.createElement('div');
			var $divContent = $(divContent);
			$divContent.css({
				position: 'absolute',
				width: 'calc(100% - 6px)',
				top: _TitleBarHeight,
				height: 'calc(100% - ' + _TitleBarHeight + ' - ' + _buttonsBarHeight + ')',
			    border: 'solid 1px ' + _INNER_BORDER_COLOR,
			    padding: '2px'
			});
			

			if (config.htmlTemplate) {
				$divContent.html(config.htmlTemplate);
			} else if (config.urlTemplate) {
				$templateRequest(config.urlTemplate).then(function(template) {
					var element = $compile(template)(config.scope);
					$divContent.append(element);
				});	
				/*
				//$divContent.load(config.urlTemplate);
				//rotinasGeral.loadjscssfile('/totalenglish/scripts/common/pronuncia/pronuncia.ctrl.js', 'js');
		        var fileref=document.createElement('script')
		        fileref.setAttribute("type","text/javascript")
		        fileref.setAttribute("src", '/totalenglish/scripts/common/pronuncia/pronuncia.ctrl.js');
		        document.getElementsByTagName("head")[0].appendChild(fileref)

				//var templateUrl = $sce.getTrustedResourceUrl(config.urlTemplate);
			    $templateRequest(config.urlTemplate).then(function(template) {
			        // template is the HTML template as a string

			        // Let's put it into an HTML element and parse any directives and expressions
			        // in the code. (Note: This is just an example, modifying the DOM from within
			        // a controller is considered bad style.)
			        $divContent.html(template);
			        //$compile($("#my-element").html(template).contents())($scope);
			    }, function() {
			        // An error has occurred
			        alert('erro')
			    });				

				//var html = '<div ng-controller="pronunciaCtrl" ng-include="' + config.urlTemplate + '"></div>';
				//$(divContent).append(html);
				//$compile($(divContent).contents());				
				*/
			}

			objWindow.appendChild(divContent);
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////			


			////////////////////////////////////////////////////
			//BUTTONS BAR
			////////////////////////////////////////////////////			
			var divButtonsBar = document.createElement('div');
			var $divButtonsBar = $(divButtonsBar);
			$divButtonsBar.css({
				position: 'absolute',
				'text-align': 'right',
				width: '100%', 
				top: 'calc(' + $objWindow.css('height') + ' - ' + _buttonsBarHeight + ' - 2px)', //2px is igual (border width * 2)
				height: _buttonsBarHeight,
			    padding: '4px',
			    'padding-right': 'calc(' + _PADDING + ' * 2)',			    
			});
			_createButtons(objWindow, divButtonsBar, config.buttons);
			objWindow.appendChild(divButtonsBar);
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////			


			return objWindow;
		}

		/**
		 *
		 */
		me.confirm = function(htmlMessage) {
			return _createDialog({
				title: 'Confirmation',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_CONFIRM, htmlMessage),
	        	buttons: [
	        		me.BUTTON.YES,
	        		me.BUTTON.NO	        		
	        	],
			});
		}

		/**
		 *
		 */
		me.info = function(htmlMessage) {
			return _createDialog({
				title: 'Information',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_INFO, htmlMessage),
	        	buttons: [
	        		me.BUTTON.OK	        		
	        	],
			});
		}


		/**
		 *
		 */
		me.warning = function(htmlMessage) {
			return _createDialog({
				title: 'Warning!',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_WARNING, htmlMessage),
	        	buttons: [
	        		me.BUTTON.OK	        		
	        	],
			});
		}

		/**
		 *
		 */
		me.error = function(htmlMessage) {
			return _createDialog({
				title: 'Error!',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_ERROR, htmlMessage),
	        	buttons: [
	        		me.BUTTON.OK	        		
	        	],
			});
		}

		/**
		 *
		 */
		 me.ghost = function(htmlTitle, htmlMessage, iconDialog) {
			var objWindow = me.createEmptyWindow({
				position: me.POSITION.TOP_RIGHT,
				width: '280px',
				height: 'auto',
				modal: false
			});

			var $objWindow = $(objWindow);
			$objWindow.css({
			    //'background-color': '#D9E5F3',
			    'background-color': '#000',
			    'border-color': _OUTTER_BORDER_COLOR,
			    'border-radius': '3px',
			    padding: '10px',
			    'box-shadow': '10px 10px 5px #888888',
			    'border-radius': '10px',
			    color: 'white',
			    opacity: 0.5
			});

			//TABLE
			var tableContent = document.createElement('table');
			$(tableContent).css({
				//border: 'solid 1px red',
				color: 'white'
			});

			//ROW
			var rowContent = tableContent.insertRow();

			//CELL IMAGE
			var cellImg = rowContent.insertCell();
			cellImg.rowSpan = 2;
			var imgDlg = document.createElement('img');
			$(imgDlg).css({
				'margin-right': '8px'
			});
			imgDlg.src = iconDialog || me.ICON_DIALOG_CHECK;
			cellImg.appendChild(imgDlg);

			//CELL TITLE
			var cellTitle = rowContent.insertCell();			
			$(cellTitle).css({
				'font-weight': 'bold',
				height: '10px',
				'padding': '0px'
			});
			cellTitle.innerHTML = htmlTitle;

			//CELL MESSAGE
			var cellMsg = tableContent.insertRow().insertCell();
			$(cellMsg).css({
				//'border': 'solid 1px red',
				'vertical-align': 'top'
			});
			cellMsg.innerHTML = htmlMessage;

			objWindow.appendChild(tableContent);
			
			objWindow.show();
			var top = $objWindow.css('top');
			$objWindow.css('top', '-' + $objWindow.css('height'));
			$objWindow.animate({top: top});
			//$objWindow.fadeIn('slow');

			setTimeout(function() {
				//$objWindow.fadeOut('slow');
				objWindow.close();
			}, 2000);
		 }

		/*
		 *
		 *
		 */
		 me.createWaiting = function(htmlMessage) {
			var objWindow = me.createEmptyWindow({
				width: 'auto',
				height: 'auto'
			});

			var $objWindow = $(objWindow);
			$objWindow.css({
			    'background-color': 'white',
			    'border-color': _OUTTER_BORDER_COLOR,
			    'border-radius': '3px',
			    //padding: '10px',
			    'box-shadow': '10px 10px 5px #888888',
			    'border-radius': '10px',
				'text-align': 'center',			    
			});

			var divMsg = document.createElement('div');
			var $divMsg = $(divMsg);
			$divMsg.html(htmlMessage);
			$divMsg.css({
				'padding-left': '20px',
				'padding-right': '20px',
				'margin-top': '10px',
				color: 'rgb(42,103,131)',				
				'line-height': '14px'
			});
			objWindow.appendChild(divMsg);

			var imgDlg = document.createElement('img');
			$(imgDlg).css({
				width: '130px',
				//height: '18px',				
				'margin-top': '15px',
				'margin-bottom': '5px'
				//height: '40px',
				//border: 'solid 1px green',
			});
			imgDlg.src = "/totalenglish/assets/images/loading6.gif";
			objWindow.appendChild(imgDlg);

			/*
			//TABLE
			var tableContent = document.createElement('table');
			$(tableContent).css({
				width: '100%',
				height: '100%',				
				border: 'solid 1px green',
				color: 'black'
			});

			//CELL IMAGE
			var cellImg = tableContent.insertRow().insertCell();
			$(cellImg).attr('height', '50px');
			//cellImg.rowSpan = 2;
			var imgDlg = document.createElement('img');
			$(imgDlg).css({
				width: '100%',
				height: '100%',
				border: 'solid 1px orange',
			});
			imgDlg.src = "/totalenglish/assets/images/loading.gif";
			cellImg.appendChild(imgDlg);

			//CELL MESSAGE
			var cellMsg = tableContent.insertRow().insertCell();
			$(cellMsg).css({
				'border': 'solid 1px red',
				'vertical-align': 'top'
			});
			cellMsg.innerHTML = htmlMessage;

			objWindow.appendChild(tableContent);
			*/

			return objWindow;
		}


		/**
		 *
		 */
		 me.createWindowDescriptionMoreImage = function(config) {
		 	config = config || {};		 	
		 	$.extend(true, config, {
				width: '550px',
				height: '270px',	
				position: me.POSITION.CENTER,
				modal: true,
				title: config.title || 'Choose a image',
	        	htmlTemplate: _TEMPLATE_DIALOG_DESCRIPTION_MORE_IMAGE,
		        buttons: [
		        	me.BUTTON.OK,
		        	me.BUTTON.CANCEL	        		
		        ],
		        listeners: {
		        	onshow: function(objWindowShowed) {
						var $objWindowShowed = $(objWindowShowed);

		        		var $descriptionEdit = $objWindowShowed.find('input[type=text]');
				        setTimeout(function(){
				            $descriptionEdit.focus();
				        }, 1);		        		

						//Seta o evento change para o file input
						var $fileInput = $objWindowShowed.find('input[type=file]');
						$fileInput.change(function(event) {
							var $img = $objWindowShowed.find('img');
							$img.attr('src', URL.createObjectURL(event.target.files[0]));
						});
		        	},

		        	oncanclose: function(objWindowCanClose) {
		        		var $objWindowCanClose = $(objWindowCanClose);

						var $descriptionEdit = $objWindowCanClose.find('input[type=text]');
						if ($descriptionEdit.val().trim() == '') {
							me.info('You must fill the description field!')
								.then(function() {
									$descriptionEdit.focus();
								});

							return false;
						}
			
						//Consiste se a imagem foi preenchida
						var $img = $objWindowCanClose.find('img');
						if (!_isImageOk($img[0])) {
							me.info('You must fill the image field!');
							return false;						
						}
						
						return true;
		        	}	
		        }
		 	});

			var objWindow = me.createWindow(config);
			return objWindow;
		}	


		/**
		 *
		 */
		function _createDialog(config) {
		 	config = config || {};		 	
		 	$.extend(true, config, {
				width: '430px',
				height: '140px',
				position: me.POSITION.CENTER,
				modal: true,
				listeners: {
					onshow: function(wnd) {
						$(wnd).find('button')[0].focus();
					}
				}
			});

			var objWindow = me.createWindow(config);

			var $objWindow = $(objWindow);


			var $table = $objWindow.find('table');
			$table.css({
				height: '100%',
				width: '100%'
			});

			var $td = $table.find('td');
			$td.css({
				padding: '4px',
				//'vertical-align': 'top'				
			});


			var $tdImg = $table.find('td:nth-child(1)');
			$tdImg.css({
				//border: 'solid 1px orange',
				'text-align': 'center'
			});

			var $img = $table.find('img');
			$img.css({
				//border: 'solid 1px orange',
			});

			var $tdMessage = $table.find('td:nth-child(2)');
			$tdMessage.css({
				//border: 'solid 1px green',
				//'padding-top': '15px'
			});

			return objWindow.show();
		}

		/**
		 *
		 */
		function _setWindowPosition(me, targetWindow, position) {
			var $targetWindow = $(targetWindow);
			var margem = 2;
			position = position || me.POSITION.CENTER;

			//HORIZONTAL LEFT
			if ((position === me.POSITION.TOP_LEFT) || (position === me.POSITION.LEFT) || (position === me.POSITION.BOTTOM_LEFT)) {
				$targetWindow.css('left', margem + 'px');				
			//HORIZONTAL CENTER
			} else if ((position === me.POSITION.TOP_CENTER) || (position === me.POSITION.CENTER) || (position === me.POSITION.BOTTOM_CENTER)) {
				$targetWindow.css('left', (window.innerWidth / 2 - targetWindow.offsetWidth / 2) + 'px');
			//HORIZONTAL RIGHT
			} else if ((position === me.POSITION.TOP_RIGHT) || (position === me.POSITION.RIGHT) || (position === me.POSITION.BOTTOM_RIGHT)) {
				$targetWindow.css('left', (window.innerWidth - targetWindow.offsetWidth - margem) + 'px');
			}

			//VERTICAL TOP
			if ((position === me.POSITION.TOP_LEFT) || (position === me.POSITION.TOP_CENTER) || (position === me.POSITION.TOP_RIGHT)) {
				$targetWindow.css('top', margem + 'px');				
			//VERTICAL CENTER
			} else if ((position === me.POSITION.LEFT) || (position === me.POSITION.CENTER) || (position === me.POSITION.RIGHT)) {
				$targetWindow.css('top', (window.innerHeight / 2 - targetWindow.offsetHeight / 2) + 'px');
			//VERTICAL BOTTOM
			} else if ((position === me.POSITION.BOTTOM_LEFT) || (position === me.POSITION.BOTTOM_CENTER) || (position === me.POSITION.BOTTOM_RIGHT)) {
				$targetWindow.css('top', (window.innerHeight - targetWindow.offsetHeight - margem) + 'px');
			}
		}

		/**
		 *
		 */
		function _createButtons(targetWindow, divButtonsBar, buttons) {
			buttons = buttons || [me.BUTTON.CLOSE];
			for (var count = 0 ; count < buttons.length ; count++) {
				var button = document.createElement('button');
				var $button = $(button);
				var response = '';

				// "YES" BUTTON
				if (buttons[count] === me.BUTTON.YES) {
					button.response = 'yes';
					$button.html('Yes');
				// "NO" BUTTON	
				} else if (buttons[count] === me.BUTTON.NO) {
					button.response = 'no';
					$button.html('No');
				// "OK" BUTTON
				} else if (buttons[count] === me.BUTTON.OK) {
					button.response = 'ok';
					$button.html('OK');
				// "CANCEL" BUTTON						
				} else if (buttons[count] === me.BUTTON.CANCEL) {
					button.response = 'cancel';
					$button.html('Cancel');
				// "CLOSE" BUTTON	
				} else /*if (buttons[count] === me.BUTTON.CLOSE) */ { //Close is a Default Button
					button.response = 'close';
					$button.html('Close');
				}

				$button.css({
					width: '80px',
					'margin-left': '2px',
				})

				$button.click(function(event) {
					targetWindow.close(event.target.response);
				});				

				divButtonsBar.appendChild(button);
			}	

		}

		/**
		 *
		 */
		var _isImageOk = function(img) {
			// During the onload event, IE correctly identifies any images that
			// weren't downloaded as not complete. Others should too. Gecko-based
			// browsers act like NS4 in that they report this incorrectly.
			if (!img.complete) {
				return false;
			}

			// However, they do have two very useful properties: naturalWidth and
			// naturalHeight. These give the true size of the image. If it failed
			// to load, either of these should be zero.
			if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
				return false;
			}

			// No other way of checking: assume it's ok.
			return true;
		}		


	}]);