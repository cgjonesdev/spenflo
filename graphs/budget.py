import os
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

plt.style.use('seaborn')
avg = lambda l: sum(l) / len(l)

class Categories:

    def __init__(self, data, name, user_id):
        current = data['current']
        historical = data['historical']

        c_spending_labels = [f'{c["category"]}: ${c["spending"]:.2f} - {c["spending_percentage"]*100:.1f}%' for c in current]
        c_expenses_labels = [f'{c["category"]}: ${c["expense"]:.2f} - {c["expense_percentage"]*100:.1f}%' for c in current]
        h_spending_labels = [f'{h["category"]}: ${h["spending"]:.2f} - {h["spending_percentage"]*100:.1f}%' for h in historical]
        h_expenses_labels = [f'{h["category"]}: ${h["expense"]:.2f} - {h["expense_percentage"]*100:.1f}%' for h in historical]

        current_spending = [c['spending'] for c in current]
        current_expenses = [c['expense'] for c in current]
        c_spending_explode = [.1] + [0] * (len(c_spending_labels) - 1)
        c_expenses_explode = [.1] + [0] * (len(c_spending_labels) - 1)
        c_spending_length = 10

        historical_spending = [h['spending'] for h in historical]
        historical_expenses = [h['expense'] for h in historical]
        h_spending_explode = [.1] + [0] * (len(h_spending_labels) - 1)
        h_expenses_explode = [.1] + [0] * (len(h_expenses_labels) - 1)
        h_spending_length = len(h_spending_labels)
        h_expenses_length = len(h_expenses_labels)

        current_bar_stack = {'expenses': current_expenses, 'spending': current_spending}
        historical_bar_stack = {'expenses': historical_expenses, 'spending': historical_spending}

        import random
        colors = random.sample(matplotlib.colors.CSS4_COLORS.keys(), len(c_spending_labels))

        fig, ax = plt.subplots(nrows=2, ncols=2, figsize=(12, 12))

        ax[0][0].pie(current_spending, explode=c_spending_explode,
                wedgeprops={'linewidth': 1, 'edgecolor': 'white'}, shadow=True, radius=1.1, colors=colors)
        bottom = np.zeros(len(c_spending_labels))
        for i, category in current_bar_stack.items():
            p = ax[0][1].bar(c_spending_labels, category, bottom=bottom)
            bottom += category
            ax[0][1].bar_label(p, label_type='center')
        #ax[0][2].pie(current_expenses, explode=c_expenses_explode,
        #    wedgeprops={'linewidth': 1, 'edgecolor': 'white'}, shadow=True, radius=1.1, colors=colors)
        ax[1][0].pie(historical_spending, explode=h_spending_explode,
            wedgeprops={'linewidth': 1, 'edgecolor': 'white'}, shadow=True, radius=1.1, colors=colors)
        bottom = np.zeros(len(h_spending_labels))
        for i, category in historical_bar_stack.items():
            p = ax[1][1].bar(h_spending_labels, category, bottom=bottom)
            bottom += category
            ax[1][1].bar_label(p, label_type='center')
        #ax[1][2].pie(historical_expenses[:h_expenses_length], explode=h_expenses_explode[:h_expenses_length],
        #    wedgeprops={'linewidth': 1, 'edgecolor': 'white'}, shadow=True, radius=1.1, colors=colors)

        fig.tight_layout()
        fig.subplots_adjust(top=0.9)
        ax[0][0].set_title('Current Spending', size='x-large')
        plt.subplots_adjust(top=0.9)
        ax[0][1].set_title('Current Spending over Expenses', size='x-large')
        ax[0][1].set_xticklabels(c_spending_labels, rotation=80)
        #ax[0][2].set_title('Current Expenses', size='x-large')
        ax[1][0].set_title('Historical Spending', size='x-large')
        ax[1][1].set_title('Historical Spending over Expenses', size='x-large')
        ax[1][1].set_xticklabels(h_spending_labels, rotation=80)
        #ax[1][2].set_title('Historical Expenses', size='x-large')
        ax[0][0].legend(labels=c_spending_labels[:c_spending_length], loc='upper left')
        ax[0][1].legend(labels=current_bar_stack, loc='upper left')
        #ax[0][2].legend(labels=c_expenses_labels, loc='upper left')
        ax[1][1].legend(labels=historical_bar_stack, loc='upper left')
        ax[1][0].legend(labels=h_spending_labels[:h_spending_length], loc='upper left')
        #ax[1][2].legend(labels=h_expenses_labels[:h_expenses_length], loc='upper left')

        filename = f'static/media/{user_id}/{name}.png'
        dirname = os.path.dirname(filename)
        if not os.path.exists(dirname):
            os.makedirs(dirname)
        plt.savefig(filename, transparent=True)
